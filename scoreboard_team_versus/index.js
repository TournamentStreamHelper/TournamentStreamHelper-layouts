LoadEverything().then(() => {
  gsap.config({ nullTargetWarn: false, trialWarn: false });

  function buildPlayerCard(hasSecondary, hasTertiary) {
    const card = document.createElement("div");
    card.className = "player container";
    card.innerHTML = `
      <div class="name">
        <div class="name_row">
          <div class="team_name"></div>
          <div class="sponsor_icon"></div>
        </div>
        <div class="player_chips"></div>
      </div>
      <div class="char_icons">
        <div class="char_slot main_slot">
          <div class="char_icon_bg main_icon_bg"></div>
          <div class="char_label char_name"></div>
        </div>
        ${hasSecondary ? `<div class="char_slot">
          <div class="char_icon_bg secondary_icon_bg"></div>
          <div class="char_label char_meta"></div>
        </div>` : ""}
        ${hasTertiary ? `<div class="char_slot">
          <div class="char_icon_bg tertiary_icon_bg"></div>
          <div class="char_label char_meta"></div>
        </div>` : ""}
      </div>
      <img class="player_avatar" />
    `;
    return card;
  }

  function buildStageRow(gameNum) {
    const row = document.createElement("div");
    row.className = "stage_row";
    row.dataset.game = gameNum;
    row.innerHTML = `
      <div class="win_indicator t1"></div>
      <div class="stage_content">
        <div class="stage_icon"></div>
        <div class="stage_name"></div>
      </div>
      <div class="win_indicator t2"></div>
    `;
    return row;
  }

  let tl;

  Start = async (event) => {
    const t1Cards = [...document.querySelectorAll(".t1 .player.container")];
    const t2Cards = [...document.querySelectorAll(".t2 .player.container")];
    const stageRows = [...document.querySelectorAll(".stage_row")];
    const maxCards = Math.max(t1Cards.length, t2Cards.length, 1);

    const playerDur = 0.7;
    const playerStagger = 0.1;
    const playersEnd = 0.2 + (maxCards - 1) * playerStagger + playerDur;

    if(tl == null){
      tl = gsap.timeline();
  
      tl.from("#header", { duration: 0.4, autoAlpha: 0, ease: "power2.out" }, 0);
      tl.from(".t1.score_side .team_logo", { duration: 0.5, x: -40, autoAlpha: 0, ease: "power2.out" }, 0.1);
      tl.from(".t2.score_side .team_logo", { duration: 0.5, x: 40, autoAlpha: 0, ease: "power2.out" }, 0.1);
      tl.from(".t1.score_side .team_identity", { duration: 0.5, x: -30, autoAlpha: 0, ease: "power2.out" }, 0.15);
      tl.from(".t2.score_side .team_identity", { duration: 0.5, x: 30, autoAlpha: 0, ease: "power2.out" }, 0.15);
      tl.from(".t1.score_side .score", { duration: 0.6, scale: 1.4, autoAlpha: 0, ease: "back.out(1.4)" }, 0.2);
      tl.from(".t2.score_side .score", { duration: 0.6, scale: 1.4, autoAlpha: 0, ease: "back.out(1.4)" }, 0.2);
  
      if (t1Cards.length) tl.from(t1Cards, { duration: playerDur, x: -120, autoAlpha: 0, stagger: playerStagger, ease: "power2.out" }, 0.2);
      if (t2Cards.length) tl.from(t2Cards, { duration: playerDur, x: 120, autoAlpha: 0, stagger: playerStagger, ease: "power2.out" }, 0.2);
  
      const t1Avatars = t1Cards.map(c => c.querySelector(".player_avatar")).filter(Boolean);
      const t2Avatars = t2Cards.map(c => c.querySelector(".player_avatar")).filter(Boolean);
      if (t1Avatars.length) tl.from(t1Avatars, { duration: 0.8, x: -180, autoAlpha: 0, stagger: playerStagger, ease: "power2.out" }, 0.35);
      if (t2Avatars.length) tl.from(t2Avatars, { duration: 0.8, x: 180, autoAlpha: 0, stagger: playerStagger, ease: "power2.out" }, 0.35);
  
      const allNames = [...t1Cards, ...t2Cards].map(c => c.querySelector(".name")).filter(Boolean);
      const allCharIcons = [...t1Cards, ...t2Cards].map(c => c.querySelector(".char_icons")).filter(Boolean);
      if (allNames.length) tl.from(allNames, { duration: 0.4, autoAlpha: 0, stagger: 0.04, ease: "power2.out" }, 0.45);
      if (allCharIcons.length) tl.from(allCharIcons, { duration: 0.4, autoAlpha: 0, stagger: 0.04, ease: "power2.out" }, 0.45);
  
      tl.from("#center_strip", { duration: 0.4, autoAlpha: 0, ease: "power2.out" }, playersEnd);
  
      const stageDelay = 0.3;
      stageRows.forEach((row, i) => {
        const t = playersEnd + 0.2 + i * stageDelay;
        tl.from(row.querySelector(".stage_content"), {
          duration: 0.35, autoAlpha: 0, y: 10, ease: "power2.out",
        }, t);
        const indicators = [...row.querySelectorAll(".win_indicator")];
        if (indicators.length) {
          tl.from(indicators, {
            duration: 0.25, autoAlpha: 0, scale: 0.5, ease: "back.out(1.7)",
          }, t + 0.22);
        }
      });
    } else {
      tl.kill();
      tl.restart();
    }
  };

  Update = async (event) => {
    let data = event.data;
    let oldData = event.oldData;
    const score = data.score[window.scoreboardNumber];
    const team1 = score.team["1"];
    const team2 = score.team["2"];
    const teams = [team1, team2];

    // Rebuild stage rows
    const stageList = document.getElementById("stage_list");
    stageList.innerHTML = "";
    const stages = score.stages || {};
    for (const [gameNum, stage] of Object.entries(stages).sort(([a], [b]) => Number(a) - Number(b))) {
      if (!stage) continue;
      const row = buildStageRow(gameNum);
      const iconPath = stage.path ? `../../${stage.path.replace(/^\.\//, "")}` : null;
      row.querySelector(".stage_icon").style.backgroundImage = iconPath ? `url("${iconPath}")` : "";
      row.querySelector(".stage_name").textContent = stage.display_name || stage.name || stage.codename || "";
      row.classList.toggle("empty", !stage.codename);
      const t1Win = row.querySelector(".win_indicator.t1");
      const t2Win = row.querySelector(".win_indicator.t2");
      t1Win.classList.toggle("won", !!stage.t1_win && !stage.tie);
      t2Win.classList.toggle("won", !!stage.t2_win && !stage.tie);
      t1Win.classList.toggle("tie", !!stage.tie);
      t2Win.classList.toggle("tie", !!stage.tie);
      t1Win.textContent = stage.tie ? "=" : "";
      t2Win.textContent = stage.tie ? "=" : "";
      stageList.appendChild(row);
    }

    // Tournament info
    const tournamentName = data.tournamentInfo?.tournamentName || "";
    const eventName = data.tournamentInfo?.eventName || "";
    SetInnerHtml($(".tournament_name"), tournamentName);
    SetInnerHtml($(".event_name"), eventName);

    // Center area: phase > match > best of
    SetInnerHtml($(".ca_phase"), [score.phase].filter(Boolean).join(""));
    SetInnerHtml($(".ca_match"), score.match || "");
    SetInnerHtml($(".ca_best_of"), score.best_of_text || "");

    // Resolve icon asset keys once — determines which char slots to show
    const gameCodename = _.get(data, "game.codename", "default");
    const secKey = _.get(tsh_settings, `secondary_icon.${gameCodename}.asset_key`)
                || _.get(tsh_settings, `secondary_icon.default.asset_key`) || "";
    const terKey = _.get(tsh_settings, `tertiary_icon.${gameCodename}.asset_key`)
                || _.get(tsh_settings, `tertiary_icon.default.asset_key`) || "";

    for (const [t, team] of teams.entries()) {
      const side = t === 0 ? "t1" : "t2";
      const teamEl = document.querySelector(`.team.${side}`);

      if (team.color && !tsh_settings["forceDefaultScoreColors"]) {
        document.querySelector(":root").style.setProperty(`--p${t + 1}-score-bg-color`, team.color);
      }

      const scoreSideEl = document.querySelector(`.score_side.${side}`);
      SetInnerHtml($(`.score_side.${side} .score`), String(team.score ?? 0));
      SetInnerHtml($(`.score_side.${side} .score_team_name`), team.teamName || "");
      scoreSideEl.querySelector(".losers_badge").classList.toggle("visible", !!team.losers);

      const teamLogoEl = scoreSideEl.querySelector(".team_logo");
      if (team.logo) {
        teamLogoEl.src = `../../${team.logo}`;
        teamLogoEl.style.display = "";
      } else {
        teamLogoEl.src = "";
        teamLogoEl.style.display = "none";
      }

      // Rebuild player cards
      const playersArea = teamEl.querySelector(".players_area");
      playersArea.innerHTML = "";

      const playerEntries = Object.entries(team.player || {})
        .sort(([a], [b]) => Number(a) - Number(b));

      for (const [playerKey, player] of playerEntries) {
        if (!player || !player.name) continue;

        const card = buildPlayerCard(!!secKey, !!terKey);
        playersArea.appendChild(card);

        // Name + org tag
        const playerName = await Transcript(player.name);
        const orgTag = player.team || "";
        SetInnerHtml($(card.querySelector(".team_name")),
          orgTag ? `<span class="sponsor">${orgTag}</span>${playerName}` : playerName,
        );

        // Chips under name — built as one HTML string so FitText scales the whole row together
        let locationText = "";
        if (player.country?.code) {
          locationText = player.country.code;
          if (player.state?.code) locationText += `/${player.state.code}`;
        }
        const chipsHtml = [
          player.seed ? `<div class="chip"><span class="seed_logo"></span>Seed ${player.seed}</div>` : "",
          player.twitter ? `<div class="chip"><span class="twitter_logo"></span>${player.twitter}</div>` : "",
          player.pronoun ? `<div class="chip"><span class="pronoun_logo"></span>${player.pronoun}</div>` : "",
          locationText ? `<div class="chip"><span class="location_icon"></span>${locationText}</div>` : "",
        ].filter(Boolean).join("");
        SetInnerHtml($(card.querySelector(".player_chips")), chipsHtml);

        // Sponsor icon
        SetInnerHtml($(card.querySelector(".sponsor_icon")),
          player.sponsor_logo ? `<img src="../../${player.sponsor_logo}" />` : "",
        );

        // Avatar (prefer local avatar over online)
        const avatarEl = card.querySelector(".player_avatar");
        if (player.avatar) {
          avatarEl.src = `../../${player.avatar}`;
          avatarEl.style.display = "";
        } else if (player.online_avatar) {
          avatarEl.src = player.online_avatar;
          avatarEl.style.display = "";
        } else {
          avatarEl.src = "";
          avatarEl.style.display = "none";
        }

        // Character icon displays (secondary/tertiary only if their asset key exists)
        const playerSource = `score.${window.scoreboardNumber}.team.${t + 1}.player.${playerKey}`;
        await CharacterDisplay($(card.querySelector(".main_icon_bg")), {
          source: playerSource,
          load_settings_path: "main_icon",
          slice_character: [0, 1],
          scale_fill_x: true,
          // scale_fill_y: true,
          custom_zoom: 1.0
        }, event);
        if (secKey) {
          await CharacterDisplay($(card.querySelector(".secondary_icon_bg")), {
            source: playerSource,
            load_settings_path: "secondary_icon",
            slice_character: [0, 1],
            scale_fill_x: true,
            // scale_fill_y: true,
            custom_zoom: 1.0
          }, event);
        }
        if (terKey) {
          await CharacterDisplay($(card.querySelector(".tertiary_icon_bg")), {
            source: playerSource,
            load_settings_path: "tertiary_icon",
            slice_character: [0, 1],
            scale_fill_x: true,
            // scale_fill_y: true,
            custom_zoom: 1.0
          }, event);
        }

        // Character name + metadata labels
        const char = Object.values(player.character || {})[0];
        SetInnerHtml($(card.querySelector(".char_name")), char?.display_name || "");
        if (secKey) {
          const secMeta = card.querySelector(".secondary_icon_bg")?.closest(".char_slot")?.querySelector(".char_meta");
          if (secMeta) SetInnerHtml($(secMeta), char?.assets?.[secKey]?.metadata?.["0"]?.value || "");
        }
        if (terKey) {
          const terMeta = card.querySelector(".tertiary_icon_bg")?.closest(".char_slot")?.querySelector(".char_meta");
          if (terMeta) SetInnerHtml($(terMeta), char?.assets?.[terKey]?.metadata?.["0"]?.value || "");
        }
      }
    }
  };
});
