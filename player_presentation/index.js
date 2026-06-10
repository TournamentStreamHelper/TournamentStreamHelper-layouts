const TOURNAMENTS = 4;
const SETS  = 4;

let config = {
  display_titles: true
}

function getNumberOrdinal(n) {
  var s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

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
  let window_config = window.config || {}
  function isDefault(value){
      return value === "" || value === -1 || value === undefined || value === null
  }
  function assignDefault(target, source){
      for (k in target){
          let value = source[k]
          if (typeof value === 'object' && value !== null){
              let matchingObject = target[k];
              if (typeof matchingObject != 'object'){
                  matchingObject = value;
              } else {
                  assignDefault(matchingObject, value);
              }
          }
          if (!isDefault(value)){
              target[k] = value
          }
      }
  }

  assignDefault(config, tsh_settings);
  assignDefault(config, window_config);

  if (!window.PLAYER) {
    window.PLAYER = 1;
  }

  let startingAnimation = gsap
    .timeline({ paused: true })
    .to([".logo"], { duration: 0.8, top: 160 }, 0)
    .to([".logo"], { duration: 0.8, scale: 0.4 }, 0)
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
    /*.from(
      [".phase_best_of"],
      { duration: 0.6, opacity: "0", ease: "power2.inOut" },
      0.6
    )*/
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
    .from([".vs1"], { duration: 0.1, opacity: "0", scale: 10, ease: "in" }, 1.2)
    .from([".vs2"], { duration: 0.01, opacity: "0" }, 1.3)
    .to([".vs2"], { opacity: 0, scale: 2, ease: "power2.out" }, 1.31)
    .from([".p1.container"], { duration: 1, x: "-200px", ease: "out" }, 0)
    .from([".p2.container"], { duration: 1, x: "200px", ease: "out" }, 0);

  Start = async (event) => {
    startingAnimation.restart();
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;

    console.log("UPDATE -------------------")

    let isTeams = Object.keys(data.score[window.scoreboardNumber].team["1"].player).length > 1;

    if (!isTeams) {

      console.log("HEY LOOK HERE ---------------");
      const teams = Object.values(data.score[window.scoreboardNumber].team);
      for (const [t, team] of teams.entries()) {
        if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
          document.querySelector(':root').style.setProperty(`--p${t + 1}-sponsor-color`, team.color);
        }
        const players = Object.values(team.player);
        for (const [p, player] of players.entries()) {
          SetInnerHtml(
            $(`.p${t + 1}.player.container .name`),
            `
              <span class="sponsor">
                ${player.team ? player.team : ""}
              </span>
              ${await Transcript(player.name)}
            `
          );

          /*
          gsap.to($(`.p${t + 1} .losers_badge`), {
            autoAlpha: team.losers ? 1 : 0,
            overwrite: true,
            duration: 0.8,
          })
            */;

          SetInnerHtml($(`.p${t + 1} .pronoun`), player.pronoun ? `<span class="pronoun_logo"></span>${player.pronoun}` : "");

          SetInnerHtml(
            $(`.p${t + 1} > .sponsor_logo`),
            player.sponsor_logo
              ? `<img class='sponsor_icon' src='../../${player.sponsor_logo}' />`
              : ""
          );

          SetInnerHtml($(`.p${t + 1} .real_name`), player.real_name);

          SetInnerHtml($(`.p${t + 1} .seed`), player.seed ? `<span class="seed_logo"></span>Seed ${player.seed}` : "");

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
            $(`.p${t + 1} .character_name`),
            `
                ${characterNames.filter(elt=>!!elt).join(" / ") + (single_variant ? makeVariantHTML(single_variant) : "")}
            `
          );

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
            $(`.p${t + 1} .flagcountry`),
            player.country.asset
              ? `<img class='flag' src='../../${player.country.asset}' /><div class='flagname'>${player.country.code}</div>`
              : ""
          );

          SetInnerHtml(
            $(`.p${t + 1} .flagstate`),
            player.state.asset
              ? `<img class='flag' src='../../${player.state.asset}' /><div class='flagname'>${player.state.code}</div>`
              : ""
          );
          

          let zIndexMultiplyier = 1;
          if (t == 1) zIndexMultiplyier = -1;

          if (!window.ONLINE_AVATAR && !window.PLAYER_AVATAR) {
            await CharacterDisplay(
              $(`.p${t + 1}.character`),
              {
                source: `score.${window.scoreboardNumber}.team.${t + 1}`,
                scale_based_on_parent: true,
                flip_x: t === 1,
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
      }

      // ------- LAST RESULTS -------------
      let history = data.score[window.scoreboardNumber].history_sets[window.PLAYER];
      let oldHistory = _.get(oldData, `score[${window.scoreboardNumber}].history_sets[${window.PLAYER}]`);
      if (JSON.stringify(history) != JSON.stringify(oldHistory)){
        
        let results_html = `<div class ="info title">${config.display_titles ? "Recent Results" : " "}</div>`
        let className = `.results`;
        let tl = gsap.timeline();
        Object.values(data.score[window.scoreboardNumber].history_sets[window.PLAYER])
          .slice(0, TOURNAMENTS)
          .forEach((sets, s) => {
            results_html += `
            <div class="tournament${s + 1} tournament_container">
              <div class="tournament_container_inner">
                <div class="tournament_logo"></div>
                <div class="placement"></div>
                <div class="tournament_info">
                  <div class="tournament_name"></div>
                  <div class="event_name"></div>
                </div>
              </div>
            </div>`;
          });
        $(className).html(results_html);

        for (const [s, tournament] of Object.values(
          data.score[window.scoreboardNumber].history_sets[window.PLAYER]
        )
          .slice(0, TOURNAMENTS)
          .entries()
        ) {
          SetInnerHtml(
            $(
              `${className} .tournament${
                s + 1
              } .tournament_container_inner .tournament_info .tournament_name`
            ),
            tournament.tournament_name
          );
          SetInnerHtml(
            $(
              `${className} .tournament${
                s + 1
              } .tournament_container_inner .tournament_info .event_name`
            ),
            tournament.event_name
          );
          SetInnerHtml(
            $(`${className} .tournament${s + 1} .tournament_container_inner .tournament_logo`),
            `
                <span class="logo" style="background-image: url('${tournament.tournament_picture}')"></span>
              `
          );
          SetInnerHtml(
            $(`${className} .tournament${s + 1} .tournament_container_inner .placement`),
            tournament.placement +
              `<span class="ordinal">${getNumberOrdinal(
                tournament.placement
              )}</span><span class="num_entrants">/${tournament.entrants}</span>`
          );
          tl.from(
            $(`.tournament${s + 1}`),
            { x: window.PLAYER == 1? 100 : -100, autoAlpha: 0, duration: 0.3 },
            0.2 + 0.2 * s
          );
        }
        tl.resume();
      }
      //------ BRACKET RUN --------

      let last_sets = data.score[window.scoreboardNumber].last_sets[window.PLAYER];
      let oldLastSets = _.get(oldData, `score[${window.scoreboardNumber}].last_sets[${window.PLAYER}]`);
      console.log("SETS", last_sets);
      if (JSON.stringify(last_sets) != JSON.stringify(oldLastSets)){
        let sets_html = `<div class ="info title">${config.display_titles ? "Current Run" : " "}</div>` ;
        Object.values(last_sets)
          .slice(0, SETS)
          .reverse()
          .forEach((set, s) => {
            let winner = set.player_score > set.oponent_score;
            sets_html += `
              <div class ="set${s + 1} set_container">
                <div class = "set_container_inner">
                  <div class = "result_tag ${winner ? "winner" : ""}">${winner ? "W" : "L"}</div>
                  <div class = "phase_match"></div>
                  <div class = "player_char"></div>
                  <div class = "set_score"></div>
                  <div class = "oponent_char"></div>
                  <div class = "name"></div>
                </div>

              </div>
            `
          })
        $(".sets").html(sets_html);
        
        let tl = gsap.timeline();
        for (const [s, [stateKey, set]] of Object.entries(last_sets)
          .slice(0, SETS)
          .reverse()
          .entries()
          ) {
          let phaseTexts = [];
          if (set.phase_name) phaseTexts.push(set.phase_name);
          if (set.phase_id) phaseTexts.push(set.phase_id);
          SetInnerHtml(
            $(`.sets .set${s + 1} .phase_match`),
            phaseTexts.join(" ") + " - " + set.round_name
          );
          SetInnerHtml(
            $(`.sets .set${s + 1} .name`),
            `
              <div class = "versus">VS</div>
              ${set.oponent_team ? `<span class="sponsor">${set.oponent_team}</span>` : ""}
              ${await Transcript(set.oponent_name)}
            `
          );
          SetInnerHtml(
            $(`.sets .set${s + 1} .set_score`),
            window.PLAYER == 2
              ? `${set.oponent_score} - ${set.player_score}`
              : `${set.player_score} - ${set.oponent_score}`
          );
          await CharacterDisplay(
            $(`.sets .set${s + 1} .player_char`),
            {
              source: `score.${window.scoreboardNumber}.last_sets.${window.PLAYER}.${stateKey}.player_char`,
            },
            event
          );
          await CharacterDisplay(
            $(`.sets .set${s + 1} .oponent_char`),
            {
              source: `score.${window.scoreboardNumber}.last_sets.${window.PLAYER}.${stateKey}.oponent_char`,
            },
            event
          );
          tl.from(
            $(`.set${s + 1}`),
            { x: window.PLAYER == 1? 100 : -100, autoAlpha: 0, duration: 0.4 },
            0.2 + 0.2 * s
          );
        }
        tl.resume();
      }
      

    } else {
      const teams = Object.values(data.score[window.scoreboardNumber].team);
      for (const [t, team] of teams.entries()) {
        // Set team colors if available
        if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
          document.querySelector(':root').style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
          document.querySelector(':root').style.setProperty(`--p${t + 1}-sponsor-color`, team.color);
        }

        let rawNames = [];
        let transcriptedNames = [];
        for (const [p, player] of Object.values(team.player).entries()) {
          if (player && player.name) {
            rawNames.push(player.name);
            transcriptedNames.push(await Transcript(player.name));
          }
        }

        let teamName = team.teamName;
        if (!team.teamName || team.teamName.trim() === "") {
          teamName = transcriptedNames
            .map(name => `<span>${name}</span>`)
            .join('<span class="slash">/</span>');
        }

        SetInnerHtml(
          $(`.p${t + 1} .name`),
          `${teamName}`
        );

        // Show player names under team name if team name exists but doesn't match player names
        if (team.teamName && team.teamName.trim()) {
          const teamNameParts = team.teamName
            .split('/')
            .map(name => name.trim())
            .sort();
          const nameParts = [...rawNames].sort();

          const isSame = teamNameParts.length === nameParts.length &&
            teamNameParts.every((val, idx) => val === nameParts[idx]);

          if (!isSame) {
            const memberElements = transcriptedNames
              .map(name => `<span>${name}</span>`)
              .join('<span class="slash">/</span>');
            SetInnerHtml(
              $(`.p${t + 1} .real_name`),
              memberElements,
            );
          } else {
            SetInnerHtml($(`.p${t + 1} .real_name`), "");
          }
        } else {
          SetInnerHtml($(`.p${t + 1} .real_name`), "");
        }

        gsap.to($(`.p${t + 1} .losers_badge`), {
          autoAlpha: team.losers ? 1 : 0,
          overwrite: true,
          duration: 0.8,
        });

        SetInnerHtml($(`.p${t + 1} > .sponsor_logo`), "");

        SetInnerHtml($(`.p${t + 1} .twitter`), ``);

        SetInnerHtml($(`.p${t + 1} .flagcountry`), "");

        SetInnerHtml($(`.p${t + 1} .flagstate`), "");

        SetInnerHtml($(`.p${t + 1} .pronoun`), "");

        SetInnerHtml($(`.p${t + 1} .seed`), _.get(team, "player.1.seed") ? `<span class="seed_logo"></span>Seed ${_.get(team, "player.1.seed")}` : "");

        let characterNames = [];

        if(!window.ONLINE_AVATAR && !window.PLAYER_AVATAR){
          for (const [p, player] of Object.values(team.player).entries()) {
            let characters = _.get(player, "character");
            for (const c of Object.values(characters)) {
              if (c.name) characterNames.push(c.name);
            }
          }
        }

        SetInnerHtml(
          $(`.p${t + 1} .character_name`),
          `
              ${characterNames.join(" / ")}
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
              flip_x: t === 1,
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
            $(`.p${t + 1}.character`),
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
      }
    }

    SetInnerHtml($(`.p1 .score`), String(data.score[window.scoreboardNumber].team["1"].score));
    SetInnerHtml($(`.p2 .score`), String(data.score[window.scoreboardNumber].team["2"].score));

    //SetInnerHtml($(".tournament"), data.tournamentInfo.tournamentName);
    //SetInnerHtml($(".match"), data.score[window.scoreboardNumber].match);

    /*SetInnerHtml(
      $(".phase_best_of"),
      data.score[window.scoreboardNumber].phase +
        (data.score[window.scoreboardNumber].best_of_text ? ` | ${data.score[window.scoreboardNumber].best_of_text}` : "")
    );*/
  };
});
