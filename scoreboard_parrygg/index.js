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
        duration: 1,
        x: (i) => (i === 0 ? -100 : 100),
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
        duration: 0.8,
        x: (i) => (i === 0 ? -200 : 200),
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

    const phase = score.phase || "";
    const tournamentName = data.tournamentInfo.tournamentName;
    const fullText =
      tournamentName +
      (shortPath ? ` ⬣ ${shortPath}` : "") +
      (phase ? ` ⬣ ${phase}` : "");
    const displayText =
      fullText.length > 50
        ? tournamentName + (phase ? ` ⬣ ${phase}` : "")
        : fullText;

    SetInnerHtml($(".tournament_name"), displayText);
    SetInnerHtml($(".info_container .match"), score.match || "");
    SetInnerHtml($(".info_container .best_of"), score.best_of_text || "");

    $(".p1.container, .p2.container").toggleClass("doubles", isTeams);

    for (const [t, team] of teams.entries()) {
      if (!isTeams) {
        const player = team.player["1"];

        if (player) {
          SetInnerHtml(
            $(`.p${t + 1} .name`),
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
        }
      } else {
        let teamName = team.teamName;
        let names = [];

        for (const player of Object.values(team.player)) {
          if (player && player.name) {
            names.push(await Transcript(player.name));
          }
        }

        let playerNames = names.join(' <span class="slash">/</span> ');

        if (!teamName || teamName === "") {
          teamName = playerNames;
        } else {
          teamName = teamName.replace(
            /\s*\/\s*/g,
            '<span class="slash">/</span>',
          );
        }

        SetInnerHtml(
          $(`.p${t + 1} .name`),
          `
            ${teamName}
            ${team.losers ? "<span class='losers'>L</span>" : ""}
          `,
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
