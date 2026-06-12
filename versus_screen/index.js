function makeVariantHTML(variant){
  let variantName = variant.display_name;
  let variantIconPath = variant.icon_path;
  let str = "";
  if (variantIconPath) {
    let y_ = 32;
    let {x, y} = variant.image_size ?? {x: 32, y: 32};
    x = x * (y_ / y);

    str += `<img src="${"../../" + variantIconPath}" class = "variant_icon" width="${x}" height="${y_}"/>`
  } 
  if (variantName) str += `<span class = "variant_name">${variantName}</span>`;

  return str;
}

LoadEverything().then(() => {
  let startingAnimation = gsap
    .timeline({ paused: true })
    .from(
      [".phase.container"],
      { duration: 0.8, opacity: "0", ease: "power2.inOut" },
      0
    )
    .from([".match"], { duration: 0.8, opacity: "0", ease: "power2.inOut" }, 0)
    .from(
      [".score_container"],
      { duration: 0.8, opacity: "0", ease: "power2.inOut" },
      0
    )
    .from(
      [".best_of.container"],
      { duration: 0.8, opacity: "0", ease: "power2.inOut" },
      0
    )
    .from([".vs"], { duration: 0.4, opacity: "0", scale: 4, ease: "out" }, 0.5)
    .from([".p1.container"], { duration: 1, x: "-100px", ease: "out" }, 0)
    .from([".p2.container"], { duration: 1, x: "100px", ease: "out" }, 0);

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    if (!isTeams) {
      const teams = Object.values(data.score[window.scoreboardNumber].team);
      for (const [t, team] of teams.entries()) {
        const players = Object.values(team.player);
        for (const [p, player] of players.entries()) {
          SetInnerHtml(
            $(`.p${t + 1} .name`),
            `${player.team ? `<span class="sponsor">${player.team}</span>` : ""}${await Transcript(player.name)}`
          );

          SetInnerHtml(
            $(`.p${t + 1} > .sponsor_logo`),
            player.sponsor_logo
              ? `<img class='sponsor_logo' src='../../${player.sponsor_logo}' />`
              : ""
          );

          SetInnerHtml($(`.p${t + 1} .real_name`), player.real_name);

          let infoGridHtml = "";
          if (player.pronoun) infoGridHtml += `<div class="pronoun"><div class="pronoun_logo"></div>${player.pronoun}</div>`;
          if (player.twitter) infoGridHtml += `<div class="twitter"><div class="twitter_logo"></div>${player.twitter}</div>`;
          if (player.seed) infoGridHtml += `<div class="seed"><div class="seed_logo"></div>Seed ${player.seed}</div>`;
          if (player.country.asset) infoGridHtml += `<div class="flagcountry"><img class='flag' src='../../${player.country.asset.toLowerCase()}' /><div class="flagname">${player.country.code}</div></div>`;
          if (player.state.asset) infoGridHtml += `<div class="flagstate"><img class='flag' src='../../${player.state.asset}' /><div class="flagname">${player.state.code}</div></div>`;
          SetInnerHtml($(`.p${t + 1} .info_grid`), infoGridHtml);

          SetInnerHtml(
            $(`.p${t + 1} .controller`),
            player.controller
              ? `<img src='../../${player.controller.icon_path}' height="20"><span class="controller_name">${player.controller.short_name}</span>`
              : ""
          );

          let characterNames = [];
          let single_variant = null;

          if(!window.ONLINE_AVATAR && !window.PLAYER_AVATAR){
            let characters = _.get(player, "character");
            
            let characterValues = Object.values(characters)
            if (tsh_settings.force_variant_last && characterValues.length > 1){
              for (const c of characterValues){
                if (c.variant){
                  if (single_variant){
                    single_variant = false;
                  } else if (single_variant === null) { //fist variant
                    single_variant = c.variant;
                  }
                }
              }
            }

            for (const c of characterValues) {

              let res = [];
              if (c.name) res.push(c.name);

              if (c.variant && !single_variant){ 
                res.push(makeVariantHTML(c.variant));
              }

              characterNames.push(res.join('<div class = "variant_intercal"></div>'))
            }

          }

          SetInnerHtml(
            $(`.p${t + 1} .character_name`),
            `
                ${characterNames.filter(elt=>!!elt).join(" / ") + (single_variant ? makeVariantHTML(single_variant) : "")}
            `
          );

          gsap.to($(`.p${t + 1} .losers_badge`), {
            autoAlpha: team.losers ? 1 : 0,
            overwrite: true,
            duration: 0.8,
          });

          let zIndexMultiplyier = 1;
          if (t == 1) zIndexMultiplyier = -1;

          if (!window.ONLINE_AVATAR && !window.PLAYER_AVATAR) {
            await CharacterDisplay(
              $(`.p${t + 1}.character`),
              {
                source: `score.${window.scoreboardNumber}.team.${t + 1}`,
                scale_based_on_parent: true,
                anim_out: {
                  x: zIndexMultiplyier * -800 + "px",
                  z: 0 + "px",
                  stagger: 0.1,
                },
                anim_in: {
                  duration: 0.4,
                  x: zIndexMultiplyier * 0 + "px",
                  z: -30 + "px",
                  ease: "in",
                  autoAlpha: 1,
                  stagger: 0.1,
                },
              },
              event
            );
          } else if (window.ONLINE_AVATAR) {
            SetInnerHtml(
              $(`.p${t + 1}.character`),
              `
                <div class="player_avatar">
                  <img src='${
                    player.online_avatar ? player.online_avatar : "./person.svg"
                  }' />
                </div>
              `,
              {
                anim_out: {
                  x: zIndexMultiplyier * -800 + "px",
                  z: 0 + "px",
                  stagger: 0.1,
                },
                anim_in: {
                  duration: 0.4,
                  x: zIndexMultiplyier * 0 + "px",
                  z: -30 + "px",
                  ease: "in",
                  autoAlpha: 1,
                  stagger: 0.1,
                },
              }
            );
          } else {
            SetInnerHtml(
              $(`.p${t + 1}.character`),
              `
                <div class="player_avatar">
                  <img src='${
                    player.avatar ? '../../'+player.avatar : "./person.svg"
                  }' />
                </div>
              `,
              {
                anim_out: {
                  x: zIndexMultiplyier * -800 + "px",
                  z: 0 + "px",
                  stagger: 0.1,
                },
                anim_in: {
                  duration: 0.4,
                  x: zIndexMultiplyier * 0 + "px",
                  z: -30 + "px",
                  ease: "in",
                  autoAlpha: 1,
                  stagger: 0.1,
                },
              }
            );
          }
        }

        if(team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    } else {
      const teams = Object.values(data.score[window.scoreboardNumber].team);
      for (const [t, team] of teams.entries()) {
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
            <div>
              ${teamName}
            </div>
          `
        );
        if(teamName != playerNames){
          SetInnerHtml($(`.p${t + 1} .real_name`), playerNames);
        } else {
          SetInnerHtml($(`.p${t + 1} .real_name`), "");
        }

        gsap.to($(`.p${t + 1} .losers_badge`), {
          autoAlpha: team.losers ? 1 : 0,
          overwrite: true,
          duration: 0.8,
        });

        SetInnerHtml($(`.p${t + 1} > .sponsor_logo`), "");
        const teamSeed = _.get(team, "player.1.seed");
        SetInnerHtml($(`.p${t + 1} .info_grid`),
          teamSeed ? `<div class="seed"><div class="seed_logo"></div>Seed ${teamSeed}</div>` : ""
        );

        let characterNames = [];

        if(!window.ONLINE_AVATAR && !window.PLAYER_AVATAR){
          for (const [p, player] of Object.values(team.player).entries()) {
            let characters = _.get(player, "character");
            for (const c of Object.values(characters)) {

              let res = [];
                if (c.name) res.push(c.name);

                if (c.variant){
                  let variantName = c.variant.display_name;
                  let variantIconPath = c.variant.icon_path;
                  let str = "";
                  if (variantIconPath) {
                    let y_ = 32;
                    let {x, y} = c.variant.image_size ?? {x: 32, y: 32};
                    x = x * (y_ / y);
                    console.log("X ; Y", x, y);

                    str += `<img src="${"../../" + variantIconPath}" class = "variant_icon" width="${x}" height="${y_}"/>`
                  } 
                  if (variantName) str += `<span class = "variant_name">${variantName}</span>`
                  res.push(str);
                }

                characterNames.push(res.join('<div class = "variant_intercal"></div>'))
            }
          }
        }

        SetInnerHtml(
          $(`.p${t + 1} .character_name`),
          `
              ${characterNames.filter(elt=>!!elt).join(" / ")}
          `
        );

        let zIndexMultiplyier = 1;
        if (t == 1) zIndexMultiplyier = -1;

        if (!window.ONLINE_AVATAR && !window.PLAYER_AVATAR) {
          await CharacterDisplay(
            $(`.p${t + 1}.character`),
            {
              source: `score.${window.scoreboardNumber}.team.${t + 1}`,
              scale_based_on_parent: true,
              anim_out: {
                x: zIndexMultiplyier * -800 + "px",
                z: 0 + "px",
                stagger: 0.1,
              },
              anim_in: {
                duration: 0.4,
                x: zIndexMultiplyier * 0 + "px",
                z: -30 + "px",
                ease: "in",
                autoAlpha: 1,
                stagger: 0.1,
              },
            },
            event
          );
        } else if (window.ONLINE_AVATAR) {
          let avatars_html = "";
          for (const [p, player] of Object.values(team.player).entries()) {
            if (player)
              avatars_html += `<img src='${
                player.online_avatar ? player.online_avatar : "./person.svg"
              }' />`;
          }
          SetInnerHtml(
            $(`.p${t + 1}.character`),
            `
              <div class="player_avatar">
                ${avatars_html}
              </div>
            `,
            {
              anim_out: {
                x: zIndexMultiplyier * -800 + "px",
                z: 0 + "px",
                stagger: 0.1,
              },
              anim_in: {
                duration: 0.4,
                x: zIndexMultiplyier * 0 + "px",
                z: -30 + "px",
                ease: "in",
                autoAlpha: 1,
                stagger: 0.1,
              },
            }
          );
        } else {
          let avatars_html = "";
          for (const [p, player] of Object.values(team.player).entries()) {
            if (player)
              avatars_html += `<img src='${
                player.avatar ? '../../'+player.avatar : "./person.svg"
              }' />`;
          }
          SetInnerHtml(
            $(`.p${t + 1}.character`),
            `
              <div class="player_avatar">
                ${avatars_html}
              </div>
            `,
            {
              anim_out: {
                x: zIndexMultiplyier * -800 + "px",
                z: 0 + "px",
                stagger: 0.1,
              },
              anim_in: {
                duration: 0.4,
                x: zIndexMultiplyier * 0 + "px",
                z: -30 + "px",
                ease: "in",
                autoAlpha: 1,
                stagger: 0.1,
              },
            }
          );
        }

        if(team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    }

    SetInnerHtml($(`.p1 .score`), String(data.score[window.scoreboardNumber].team["1"].score));
    SetInnerHtml($(`.p2 .score`), String(data.score[window.scoreboardNumber].team["2"].score));

    SetInnerHtml($(".tournament"), data.tournamentInfo.tournamentName);
    SetInnerHtml($(".event"), data.tournamentInfo.eventName);
    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);

    SetInnerHtml(
      $(".phase:not(.container)"),
      data.score[window.scoreboardNumber].phase ? data.score[window.scoreboardNumber].phase : ""
    );
  
    SetInnerHtml(
      $(".container .best_of"),
      data.score[window.scoreboardNumber].best_of_text ? data.score[window.scoreboardNumber].best_of_text : ""
    );

    let selectedStage = _.get(data, `score.${window.scoreboardNumber}.stage_strike.selectedStage`);
    let stage = _.get(data, `score.${window.scoreboardNumber}.stage_strike.selectedStageData`)
      || (selectedStage ? _.get(data, `game.stages.${selectedStage}`) : null);

    if (
      stage &&
      _.get(data, `score.${window.scoreboardNumber}.stage_strike.selectedStage`) !=
        _.get(oldData, `score.${window.scoreboardNumber}.stage_strike.selectedStage`)
    ) {
      gsap.fromTo(
        $(`.stage`),
        { scale: 1.6 },
        { scale: 1.2, duration: 0.6, ease: "power2.out" }
      );
    }

    SetInnerHtml(
      $(`.stage`),
      stage
        ? `
        <div>
            <div class='' style="background-image: url('../../${stage.path}');">
            </div>
        </div>`
        : ""
    );
  };
});
