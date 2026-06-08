LoadEverything().then(() => {
  gsap.config({ nullTargetWarn: false, trialWarn: false });

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".fade"],
      {
        duration: 0.2,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0,
    )
    .from(
      [".fade_right"],
      {
        duration: 0.2,
        x: "-20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0,
    )
    .from(
      [".fade_left"],
      {
        duration: 0.2,
        x: "+20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0,
    )
    .from(
      [".p1.container"],
      {
        duration: 0.8,
        x: -150,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0,
    )
    .from(
      [".p2.container"],
      {
        duration: 0.8,
        x: 150,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0,
    )
    .from(
      [".p1 .character_bg", ".p2 .character_bg"],
      {
        duration: 0.8,
        x: (i) => (i === 0 ? -200 : 200),
        autoAlpha: 0,
        ease: "power2.out",
      },
      0.2,
    )
    .from(
      [".p1 .top-row", ".p2 .top-row"],
      {
        delay: 0.3,
        duration: 0.5,
        x: (i) => (i === 0 ? -50 : 50),
        autoAlpha: 0,
        delay: 0.1,
        ease: "power2.out",
      },
      0.2,
    )
    .from(
      [".p1 .name", ".p2 .name"],
      {
        delay: 0.3,
        duration: 0.5,
        x: (i) => (i === 0 ? -50 : 50),
        autoAlpha: 0,
        ease: "power2.out",
      },
      0.2,
    )

    .from(
      [".info_container"],
      {
        duration: 0.8,
        x: -50,
        autoAlpha: 0,
        ease: "power2.out",
      },
      0,
    )
    .from(
      [".parrygg_logo"],
      {
        duration: 0.6,
        scale: 0,
        rotation: -90,
        autoAlpha: 0,
        ease: "back.out(1.5)",
      },
      0.3,
    )
    .from(
      [".info > div"],
      {
        duration: 0.6,
        x: -20,
        autoAlpha: 0,
        stagger: 0.1,
        ease: "power2.out",
      },
      0.4,
    );

  // I delay this just to make sure the fonts load -seven
  Start = async () => {
    gsap.delayedCall(1, () => startingAnimation.restart());
  };

  Update = async (event) => {
    const data = event.data;
    const score = data.score[window.scoreboardNumber];
    const team1 = score.team["1"];
    const team2 = score.team["2"];
    const teams = [team1, team2];

    const isTeams = Object.keys(team1.player).length > 1;

    const rawShortLink = data.tournamentInfo.shortLink;
    let shortPath = "";
    if (rawShortLink) {
      try {
        shortPath = new URL(rawShortLink).pathname;
      } catch {
        shortPath = rawShortLink.startsWith("/")
          ? rawShortLink
          : `/${rawShortLink}`;
      }
    }

    const tournamentName = data.tournamentInfo.tournamentName || "";
    const eventName = data.tournamentInfo.eventName || "";
    const phase = score.phase || "";
    const match = score.match || "";
    const bestOf = score.best_of_text || "";

    // Top: tournament name and event name
    const topParts = [tournamentName, eventName].filter(Boolean);
    const topText = topParts.join(" - ");

    // Bottom: phase and best_of
    const bottomParts = [phase, bestOf].filter(Boolean);
    const bottomText = bottomParts.join(" - ");

    SetInnerHtml($(".tournament_name"), topText);
    SetInnerHtml($(".match"), match);
    SetInnerHtml($(".phase"), bottomText);

    $(".p1.container, .p2.container").toggleClass("doubles", isTeams);

    for (const [t, team] of teams.entries()) {
      // Set team colors from state if available
      if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
        document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
      }

      if (!isTeams) {
        const player = team.player["1"];

        if (player) {
          SetInnerHtml(
            $(`.p${t + 1} .team_name`),
            `
              <span class="sponsor">
                ${player.team ? player.team : ""}
              </span>
              ${await Transcript(player.name)}
              ${team.losers ? "<span class='losers'>L</span>" : ""}
            `,
          );

          await CharacterDisplay(
            $(`.p${t + 1} .character_bg`),
            {
              source: `score.${window.scoreboardNumber}.team.${t + 1}`,
            },
            event,
          );

          SetInnerHtml(
            $(`.p${t + 1} .twitter`),
            player.twitter
              ? `<span class="twitter_logo"></span>${String(player.twitter)}`
              : "",
          );

          SetInnerHtml(
            $(`.p${t + 1} .pronoun`),
            player.pronoun
              ? `<span class="pronoun_logo"></span>${player.pronoun}`
              : "",
          );

          SetInnerHtml(
            $(`.p${t + 1} .seed`),
            player.seed
              ? `<span class="seed_logo"></span>Seed ${player.seed}`
              : "",
          );

          let locationText = "";
          if (player.country.code) {
            locationText = player.country.code;
            if (player.state.code) {
              locationText += `/${player.state.code}`;
            }
          }
          SetInnerHtml(
            $(`.p${t + 1} .location`),
            locationText ? `<span class="location_icon"></span>${locationText}` : ""
          );

          // Set sponsor icon if available
          SetInnerHtml(
            $(`.p${t + 1} .sponsor_icon`),
            player.sponsor_logo
              ? `<img src="../../${player.sponsor_logo}" />`
              : ""
          );

          SetInnerHtml($(`.p${t + 1} .team_members`), "");
        }
      } else {
        // DOUBLES
        let teamName = team.teamName;
        let rawNames = [];
        let transcriptedNames = [];

        for (const player of Object.values(team.player)) {
          if (player && player.name) {
            rawNames.push(player.name);
            transcriptedNames.push(await Transcript(player.name));
          }
        }

        let playerNames = transcriptedNames
          .map(name => `<span>${name}</span>`)
          .join('<span class="slash">/</span>');

        if (!teamName || teamName === "") {
          teamName = playerNames;
        } else {
          teamName = teamName.replace(
            /\s*\/\s*/g,
            '<span class="slash">/</span>',
          );
        }

        SetInnerHtml(
          $(`.p${t + 1} .team_name`),
          `
            ${teamName}
            ${team.losers ? "<span class='losers'>L</span>" : ""}
          `,
        );

        // Show player names under team name if team name exists
        if (team.teamName && team.teamName.trim()) {
          const memberElements = transcriptedNames
            .map(name => `<span>${name}</span>`)
            .join('<span class="slash">/</span>');
          SetInnerHtml(
            $(`.p${t + 1} .team_members`),
            memberElements,
          );
        } else {
          SetInnerHtml($(`.p${t + 1} .team_members`), "");
        }

        // Show seed for first player only in doubles
        const firstPlayer = Object.values(team.player)[0];
        SetInnerHtml(
          $(`.p${t + 1} .seed`),
          firstPlayer && firstPlayer.seed
            ? `<span class="seed_logo"></span>Seed ${firstPlayer.seed}`
            : "",
        );

        SetInnerHtml($(`.p${t + 1} .location`), "");
        SetInnerHtml($(`.p${t + 1} .pronoun`), "");
        SetInnerHtml($(`.p${t + 1} .twitter`), "");

        // Set team logo if available
        SetInnerHtml(
          $(`.p${t + 1} .sponsor_icon`),
          team.logo
            ? `<img src="../../${team.logo}" />`
            : ""
        );

        await CharacterDisplay(
          $(`.p${t + 1} .character_bg`),
          {
            source: `score.${window.scoreboardNumber}.team.${t + 1}`,
            slice_character: [0, 1],
          },
          event,
        );
      }

      SetInnerHtml($(`.p${t + 1} .score`), String(team.score));
    }
  };
});
