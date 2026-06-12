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
    .to([".logo"], { duration: 0.8, top: 160 }, 0)
    .to([".logo"], { duration: 0.8, scale: 0.4 }, 0)
    .fromTo(
      ".p1.character_name",
      {
        x: "-100px",
        autoAlpha: 0,
      },
      {
        x: "-60px",
        autoAlpha: 1,
        duration: 2,
        ease: "power2.out"
      },
      0
    )
    .to(
      ".p1.character_name",
      {
        duration: 0.2,
        x: "-20px",
        scale: 1.1,
        ease: "power2.out"
      },
      2
    )
    .to(
      ".p1.character_name",
      {
        duration: 2,
        x: "0px",
        ease: "power2.out"
      },
      2.2
    )
    .fromTo(
      ".p2.character_name",
      {
        x: "100px",
        autoAlpha: 0,
      },
      {
        x: "60px",
        autoAlpha: 1,
        duration: 2,
        ease: "power2.out"
      },
      0
    )
    .to(
      ".p2.character_name",
      {
        duration: 0.2,
        x: "+20px",
        scale: 1.1,
        ease: "power2.out"
      },
      2
    )
    .to(
      ".p2.character_name",
      {
        duration: 2,
        x: "0px",
        ease: "power2.out"
      },
      2.2
    )
    .fromTo(
      ".p1.character",
      {
        x: "-1000px",
        autoAlpha: 0,
      },
      {
        x: "-50px",
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      2
    )
    .to(
      ".p1.character",
      {
        x: "0",
        duration: 4,
        ease: "power1.out"
      },
      2.2
    )
    .fromTo(
      ".p2.character",
      {
        x: "+1000px",
        autoAlpha: 0,
      },
      {
        x: "+50px",
        autoAlpha: 1,
        duration: 0.2,
        ease: "power2.out",
      },
      2
    )
    .to(
      ".p2.character",
      {
        x: "0",
        duration: 4,
        ease: "power1.out"
      },
      2.2
    )
    .from(
      [".tournament"],
      { duration: 0.6, opacity: "0", ease: "power2.inOut" },
      0.2
    )
    .from(
      [".match"],
      { duration: 0.6, opacity: "0", ease: "power2.inOut" },
      0.4
    )
    .from(
      [".phase_best_of"],
      { duration: 0.6, opacity: "0", ease: "power2.inOut" },
      0.6
    )
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
    .fromTo(
      [".vs1"],
      { opacity: 0, scale: 1.2 },
      { opacity: 0.8, ease: "in", duration: 2.1 },
      0
    )
    .to([".vs1"], { duration: 0.03, opacity: "1", scale: 1 }, 2.1)
    .from([".vs2"], { duration: 0.01, opacity: "0" }, 2.13)
    .to(
      [".vs2"],
      {
        opacity: 0,
        scale: 1.2,
        ease: "power2.out",
        duration: 1,
      },
      2.4
    )

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
            `${player.team ? `<span class="sponsor">${player.team}</span>` : ""}${await Transcript(player.name)}${team.losers ? "<span class='losers'>L</span>" : ""}`
          );

          SetInnerHtml($(`.p${t + 1} .pronoun`), player.pronoun);

          SetInnerHtml(
            $(`.p${t + 1}.sponsor_logo`),
            player.sponsor_logo
              ? `<img class='sponsor-logo' src='../../${player.sponsor_logo}' />`
              : ""
          );

          SetInnerHtml(
            $(`.p${t + 1} .seed`),
            player.seed ? `
              <div class="unskew">Seed ${player.seed}</div>
            ` : ""
          );

          SetInnerHtml($(`.p${t + 1} .real_name`), player.real_name);

          SetInnerHtml(
            $(`.p${t + 1} .twitter`),
            `
              ${
                player.twitter
                  ? `
                  <div class="twitter_logo"></div>
                  ${player.twitter}
                  `
                  : ""
              }
          `
          );

          SetInnerHtml(
            $(`.p${t + 1} .country`),
            player.country.asset
              ? `
                <div class="unskew">
                  <img class='flagimage' src='../../${player.country.asset}' />
                  <div class="flagname">${player.country.name}</div>
                </div>
              `
              : ""
          );

          SetInnerHtml(
            $(`.p${t + 1} .state`),
            player.state.asset
              ? `
                <div class="unskew">
                  <img class='flagimage' src='../../${player.state.asset}' />
                  <div class="flagname">${player.state.name}</div>
                </div>
              `
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
                    single_variant == false;
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
            $(`.p${t + 1}.character_name`),
            `
                ${characterNames.filter(elt=>!!elt).join(" / ") + (single_variant ? makeVariantHTML(single_variant) : "")}
            `
          );


          $(`.p${t + 1}.character_name`).css({"font-size": 500/characterNames.length})

          let zIndexMultiplyier = 1;
          if (t == 1) zIndexMultiplyier = -1;

          if (!window.ONLINE_AVATAR && !window.PLAYER_AVATAR) {
            await CharacterDisplay(
              $(`.p${t + 1}.character > div`),
              {
                source: `score.${window.scoreboardNumber}.team.${t + 1}`,
                scale_based_on_parent: true,
                anim_out: {
                  x: -zIndexMultiplyier * 100 + "%",
                  stagger: 0.1,
                },
                anim_in: {
                  x: 0,
                  duration: 1,
                  ease: "expo.out",
                  autoAlpha: 1,
                  stagger: 0.2,
                },
                custom_center: [0.4, 0.4]
              },
              event
            );
          } else if (window.ONLINE_AVATAR) {
            SetInnerHtml(
              $(`.p${t + 1}.character > div`),
              `
                <div class="player_avatar">
                  <img src='${
                    player.online_avatar ? player.online_avatar : "./person.svg"
                  }' />
                </div>
              `,
              {
                anim_out: {
                  x: -zIndexMultiplyier * 100 + "%",
                  stagger: 0.1,
                },
                anim_in: {
                  x: 0,
                  duration: 1,
                  ease: "expo.out",
                  autoAlpha: 1,
                  stagger: 0.2,
                },
              }
            );
          } else {
            SetInnerHtml(
              $(`.p${t + 1}.character > div`),
              `
                <div class="player_avatar">
                  <img src='${
                    player.avatar ? '../../'+player.avatar : "./person.svg"
                  }' />
                </div>
              `,
              {
                anim_out: {
                  x: -zIndexMultiplyier * 100 + "%",
                  stagger: 0.1,
                },
                anim_in: {
                  x: 0,
                  duration: 1,
                  ease: "expo.out",
                  autoAlpha: 1,
                  stagger: 0.2,
                },
              }
            );
          }
        }

        if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
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

        SetInnerHtml($(`.p${t + 1} .name`), teamName);
        if(teamName != playerNames){
          SetInnerHtml($(`.p${t + 1} .real_name`), playerNames);
        } else {
          SetInnerHtml($(`.p${t + 1} .real_name`), "");
        }

        SetInnerHtml($(`.p${t + 1} .sponsor_logo`), "");

        SetInnerHtml($(`.p${t + 1} .twitter`), ``);

        SetInnerHtml($(`.p${t + 1} .country`), "");

        SetInnerHtml($(`.p${t + 1} .state`), "");

        SetInnerHtml($(`.p${t + 1} .pronoun`), "");

        SetInnerHtml($(`.p${t + 1} .seed`), _.get(team, "player.1.seed") ? `<div class="unskew">Seed ${_.get(team, "player.1.seed")}</div>` : "");

        let characterNames = [];

        if(window.ONLINE_AVATAR || window.PLAYER_AVATAR){
          for (const [p, player] of Object.values(team.player).entries()) {
            if (player.name) characterNames.push(player.name);
          }
        } else {
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

        $(`.p${t + 1}.character_name`).css({"font-size": 500/characterNames.length})

        let zIndexMultiplyier = 1;
        if (t == 1) zIndexMultiplyier = -1;

        if (!window.ONLINE_AVATAR && !window.PLAYER_AVATAR) {
          await CharacterDisplay(
            $(`.p${t + 1}.character > div`),
            {
              source: `score.${window.scoreboardNumber}.team.${t + 1}`,
              scale_based_on_parent: true,
              anim_out: {
                x: -zIndexMultiplyier * 100 + "%",
                stagger: 0.1,
              },
              anim_in: {
                x: 0,
                duration: 1,
                ease: "expo.out",
                autoAlpha: 1,
                stagger: 0.2,
              },
              custom_center: [0.4, 0.4]
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
            $(`.p${t + 1}.character > div`),
            `
              <div class="player_avatar">
                ${avatars_html}
              </div>
            `,
            {
              anim_out: {
                x: -zIndexMultiplyier * 100 + "%",
                stagger: 0.1,
              },
              anim_in: {
                x: 0,
                duration: 1,
                ease: "expo.out",
                autoAlpha: 1,
                stagger: 0.2,
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
            $(`.p${t + 1}.character > div`),
            `
              <div class="player_avatar">
                ${avatars_html}
              </div>
            `,
            {
              anim_out: {
                x: -zIndexMultiplyier * 100 + "%",
                stagger: 0.1,
              },
              anim_in: {
                x: 0,
                duration: 1,
                ease: "expo.out",
                autoAlpha: 1,
                stagger: 0.2,
              },
            }
          );
        }

        if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
        }
      }
    }

    SetInnerHtml($(`.p1.score`), String(data.score[window.scoreboardNumber].team["1"].score));
    SetInnerHtml($(`.p2.score`), String(data.score[window.scoreboardNumber].team["2"].score));

    SetInnerHtml($(".tournament"), data.tournamentInfo.tournamentName);
    SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);

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
        { scale: 2 },
        { scale: 1.2, duration: 0.8, ease: "power2.out" }
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

    SetInnerHtml(
      $(`.stage_name`),
      stage
        ? `
          <div class="title">
            STAGE
          </div>
          <div class="name">
            ${stage.name}
          </div>
        </div>`
        : ""
    );

    SetInnerHtml(
      $(".phase_best_of"),
      data.score[window.scoreboardNumber].phase +
        (data.score[window.scoreboardNumber].best_of_text ? ` | ${data.score[window.scoreboardNumber].best_of_text}` : "")
    );
  };
});
