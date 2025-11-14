// https://www.start.gg/tournament/testing-for-one-more-game/event/hdr
// https://www.start.gg/tournament/testing-for-one-more-game/event/pm-doubles
// https://www.start.gg/tournament/testing-for-one-more-game/event/pm-doubles-2

LoadEverything().then(() => {
  
  gsap.config({ nullTargetWarn: false, trialWarn: false });

  // 1. Set, Run animations

  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".fade"],
      {
        // duration: 0.2,
        duration: 1.2,
        autoAlpha: 0,
        ease: "power2.out",
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
      [".fade_down"],
      {
        // duration: 0.2,
        // duration: 0.4,
        y: "-20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_right"],
      {
        // duration: 0.2,
        // x: "-20px",
        duration: 0.6,
        x: "-60px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_left"],
      {
        // duration: 0.2,
        // x: "+20px",
        duration: 0.6,
        x: "+60px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )
    .from(
      [".fade_up"],
      {
        // duration: 0.2,
        duration: 0.8,
        y: "+20px",
        ease: "power2.out",
        autoAlpha: 0,
      },
      0
    )

  Start = async () => {
    startingAnimation.restart();
  };

  // 2. Set data
  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    const points = [];
    points.push(document.querySelector(".p1.points"));
    points.push(document.querySelector(".p2.points"));
    
    if (!isTeams) {
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        for (const [p, player] of [team.player["1"]].entries()) {
          if (player) {
            SetInnerHtml(
              $(`.p${t + 1}.container .name`),
              `
                ${player.team ? `<span class="sponsor">${player.team}</span>` : ""}
                ${await Transcript(player.name)}
                ${team.losers ? "<span class='losers'>L</span>" : ""}
              `
            );

            SetInnerHtml(
              $(`.p${t + 1} .flagcountry`),
              player.country.asset
                ? `
                  <div class='flag' style='background-image: url(../../${player.country.asset.toLowerCase()})'></div>
                  <!-- <div>${player.country.code}</div> -->
                `
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .flagstate`),
              player.state.asset
                ? `
                  <div class='flag' style='background-image: url(../../${player.state.asset})'></div>
                  <!-- <div>${player.state.code}</div> -->
                `
                : ""
            );

            await CharacterDisplay(
              $(`.p${t + 1}.container .character_container`),
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
              $(`.p${t + 1}.container .avatar`),
              player.avatar
                ? `<div style="background-image: url('../../${player.avatar}')"></div>`
                : ""
            );

            SetInnerHtml(
              $(`.p${t + 1}.container .online_avatar`),
              player.online_avatar
                ? `<div style="background-image: url('${player.online_avatar}')"></div>`
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
              player.pronoun ? player.pronoun : ""
            );

            SetInnerHtml(
              $(`.p${t + 1} .seed`),
              player.seed ? `Seed ${player.seed}` : ""
            );
            
            if (data.score[window.scoreboardNumber].first_to) {
              for (let i = 0; i < points[t].children.length; i++) {
                i < data.score[window.scoreboardNumber].first_to
                ? points[t].children[i].style.display = "block"
                : points[t].children[i].style.display = "none";
              }
            }

            for (let i = 0; i < data.score[window.scoreboardNumber].first_to; i++) {
              i < team.score
              ? points[t].children[i].classList.add("active")
              : points[t].children[i].classList.remove("active");
            }
          }
        }
        if(team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    } else {
      for (const [t, team] of [
        data.score[window.scoreboardNumber].team["1"],
        data.score[window.scoreboardNumber].team["2"],
      ].entries()) {
        let teamName = team.teamName;

        let names = [];
        let namesSponsored = [];
        console.log(Object.values(team.player));
        for (const [p, player] of Object.values(team.player).entries()) {
          if (player && player.name) {
            names.push(await Transcript(player.name));
            namesSponsored.push(`
              ${player.team ? `<span class="sponsor">${player.team}</span>` : ""}
              ${await Transcript(player.name)}
            `);
          }
        }
        let playerNames = names.join(" / ");
        let playerNamesRev = names.reverse().join(" / ");
        let playerNamesSponsored = namesSponsored.join(`
          <span class="doubles_divider">/</span>
        `);
        
        if (
          !team.teamName
          || team.teamName == ""
          || team.teamName == playerNames
          || team.teamName == playerNamesRev
        ) {
          teamName = playerNamesSponsored;
        }

        SetInnerHtml(
          $(`.p${t + 1}.container .name`),
          `
            ${teamName}
            ${team.losers ? "<span class='losers'>L</span>" : ""}
          `
        );

        await CharacterDisplay(
          $(`.p${t + 1}.container .character_container`),
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

        // NOTE: repurposed inexplicitly
        SetInnerHtml($(`.p${t + 1} .twitter`), 
          playerNames != teamName ? playerNamesSponsored : ""
        );

        SetInnerHtml($(`.p${t + 1} .seed`), 
          player.seed ? `Seed ${player[1].seed}` : ""
        );

        if(team.color) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    }

    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);

    let phaseTexts = [];
    if (data.score[window.scoreboardNumber].phase) phaseTexts.push(data.score[window.scoreboardNumber].phase);
    // if (data.score[window.scoreboardNumber].best_of_text) phaseTexts.push(data.score[window.scoreboardNumber].best_of_text);

    SetInnerHtml($(".phase"), phaseTexts.join(" - "));
  };
});
