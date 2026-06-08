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
      0
    )
    /* Logo snaps from slightly oversized to final — draws the eye to the center */
    .from(
      [".logo.fade"],
      {
        scale: 1.28,
        duration: 0.22,
        ease: "power3.out",
        transformOrigin: "center center",
      },
      0
    )
    .from(
      [".fade_down_left_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
          y: "-20px",
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_down_right_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
          y: "-20px",
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_up_left_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
          y: "20px",
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_up_right_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
          y: "20px",
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".p1 .fade_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".p2 .fade_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".p1 .fade_stagger_reverse:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'start',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".p2 .fade_stagger_reverse:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'start',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_right_stagger:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_right_stagger2:not(.text_empty)"],
      {
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'end',
          opacity: 0,
        },
        duration: 0.2,
      },
      0
    )
    .from(
      [".fade_down"],
      {
        duration: 0.2,
        y: "-20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_right"],
      {
        duration: 0.2,
        x: "-20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_left"],
      {
        duration: 0.2,
        x: "+20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_up"],
      {
        duration: 0.2,
        y: "+20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )

  Start = async () => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    if (!isTeams) {
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        for (const [p, player] of [team.player["1"]].entries()) {
          if (player) {
            SetInnerHtml(
              $(`.p${t + 1} .name`),
              `
                <span class="sponsor">
                  ${player.team ? player.team : ""}
                </span>
                ${await Transcript(player.name)}
                ${team.losers ? "<span class='losers'>L</span>" : ""}
              `
            );

            SetInnerHtml(
              $(`.p${t + 1} .flagcountry`),
              player.country.asset
                ? `
                  <img class='flag' src='../../${player.country.asset.toLowerCase()}' />
                  <div>${player.country.code}</div>
                `
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .flagstate`),
              player.state.asset
                ? `
                  <img class='flag' src='../../${player.state.asset}' />
                  <div>${player.state.code}</div>
                `
                : ""
            );

            await CharacterDisplay(
              $(`.p${t + 1} .character_container`),
              {
                asset_key: "base_files/icon",
                source: `score.${window.scoreboardNumber}.team.${t + 1}`,
                scale_fill_x: true,
                scale_fill_y: true,
                custom_zoom: 1.0
              },
              event
            );

            SetInnerHtml(
              $(`.p${t + 1} .sponsor_icon`),
              player.sponsor_logo
                ? `<img src="../../${player.sponsor_logo}" />`
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .avatar`),
              player.avatar
                ? `<img src="../../${player.avatar}" />`
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .online_avatar`),
              player.online_avatar
                ? `<img src="${player.online_avatar}" />`
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .twitter`),
              player.twitter
                ? `<span class="twitter_logo"></span>${String(player.twitter)}`
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .pronoun`),
              player.pronoun ? `<span class="pronoun_logo"></span>${player.pronoun}` : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .seed`),
              player.seed ? `<span class="seed_logo"></span>Seed ${player.seed}` : ""
            );

            SetInnerHtml($(`.p${t + 1} .score`), String(team.score));

            SetInnerHtml(
              $(`.p${t + 1} .sponsor-container`),
              `<div class='sponsor-logo' style="background-image: url('../../${player.sponsor_logo}')"></div>`
            );

            if ($(".sf6.online").length > 0) {
              console.log(player.twitter);
              console.log(player.pronoun);
              if (!player.twitter && !player.pronoun) {
                gsap.to($(`.p${t + 1}.chips`), { autoAlpha: 0 });
              } else {
                gsap.to($(`.p${t + 1}.chips`), { autoAlpha: 1 });
              }
            }
          }
        }
        if(team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
          document.querySelector(':root').style.setProperty(`--p${t + 1}-sponsor-color`, team.color);
        }
      }
    } else {
      // Doubles
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        let teamName = team.teamName;

        let names = [];
        for (const [p, player] of Object.values(team.player).entries()) {
          if (player && player.name) {
            names.push(await Transcript(player.name));
          }
        }
        let playerNames = names.join(" / ");

        if (!team.teamName || team.teamName == "") {
          teamName = playerNames;
        }

        SetInnerHtml(
          $(`.p${t + 1} .name`),
          `
            ${teamName}
            ${team.losers ? "<span class='losers'>L</span>" : ""}
          `
        );

        SetInnerHtml($(`.p${t + 1} .flagcountry`), "");

        SetInnerHtml($(`.p${t + 1} .flagstate`), "");

        await CharacterDisplay(
          $(`.p${t + 1} .character_container`),
          {
            asset_key: "base_files/icon",
            source: `score.${window.scoreboardNumber}.team.${t + 1}`,
            slice_character: [0, 1],
            scale_fill_x: true,
            scale_fill_y: true,
            custom_zoom: 1.0
          },
          event
        );

        SetInnerHtml($(`.p${t + 1} .sponsor_icon`), "");
        SetInnerHtml($(`.p${t + 1} .avatar`), "");
        SetInnerHtml($(`.p${t + 1} .online_avatar`), "");
        SetInnerHtml($(`.p${t + 1} .pronoun`), "");

        SetInnerHtml($(`.p${t + 1} .twitter`), 
          team.teamName ? playerNames : ""
        );

        SetInnerHtml($(`.p${t + 1} .score`), String(team.score));

        SetInnerHtml($(`.p${t + 1} .sponsor-container`), "");

        if(team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
          document.querySelector(':root').style.setProperty(`--p${t + 1}-sponsor-color`, team.color);
        }
      }
    }

    SetInnerHtml($(".tournament_name"), data.tournamentInfo.tournamentName);
    SetInnerHtml($(".event_name"), data.tournamentInfo.eventName);

    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);

    let phaseTexts = [];
    if (data.score[window.scoreboardNumber].phase) phaseTexts.push(data.score[window.scoreboardNumber].phase);
    if (data.score[window.scoreboardNumber].best_of_text) phaseTexts.push(data.score[window.scoreboardNumber].best_of_text);

    SetInnerHtml($(".phase"), phaseTexts.join(" - "));
  };
});
