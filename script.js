const players = document.getElementById("players");

// ====================
// 玩家資料
// ====================

let playerData = [];

// ===================
// 遊戲狀態
// ====================

let currentNight = 1;

let wolfTarget = null;

let antidoteUsed = false;
let antidoteTonight = false;

let poisonUsed = false;

let poisonTarget = null;

let votes = {};

let gameHistory = [];


// ====================
// 建立玩家設定
// ====================

function createPlayers() {

    const count =
        Number(
            document.getElementById("playerCount").value
        );


    players.innerHTML = "";


    for (let i = 1; i <= count; i++) {

        players.innerHTML += `

            <div>

                <label>
                    ${i}號：
                </label>

                <input
                    type="text"
                    placeholder="輸入暱稱"
                    id="name-${i}"
                >

                <select id="role-${i}">

                    <option>平民</option>
                    <option>狼人</option>
                    <option>預言家</option>
                    <option>女巫</option>

                </select>

            </div>

        `;
    }
}


// ====================
// 頁面載入時建立玩家
// ====================

createPlayers();


// ====================
// 開始遊戲
// ====================

function startGame() {

    const count =
        Number(
            document.getElementById("playerCount").value
        );


    // 清空上一局資料
    playerData = [];

    currentNight = 1;

    wolfTarget = null;

    antidoteUsed = false;
    antidoteTonight = false;

    poisonUsed = false;

    poisonTarget = null;

    votes = {};

    gameHistory = [];


    // 讀取玩家資料
    for (let i = 1; i <= count; i++) {

        const name =
            document.getElementById(`name-${i}`).value;

        const role =
            document.getElementById(`role-${i}`).value;


        playerData.push({

            number: i,

            name:
                name.trim() === ""
                    ? `${i}號玩家`
                    : name,

            role: role,

            alive: true

        });
    }


    // 更新玩家狀態
    updateAlivePlayers();


    // 記錄遊戲開始
    gameHistory.push({

        type: "遊戲開始",

        text:
            `🎮 遊戲開始，共 ${count} 名玩家`

    });


    // 進入第一晚
    document.getElementById("game").innerHTML = `

        <h2>🌙 第 ${currentNight} 晚</h2>

        <p>
            天黑請閉眼。
        </p>

        <button onclick="wolfTurn()">
            🐺 狼人請睜眼
        </button>

    `;
}


// ====================
// 更新玩家狀態
// ====================

function updateAlivePlayers() {

    const aliveList =
        document.getElementById("aliveList");

    let html = "";


    for (const player of playerData) {

        if (player.alive) {

            html += `

                <div>
                    🟢 ${player.number}號・${player.name}
                    ｜${player.role}
                </div>

            `;

        } else {

            html += `

                <div>
                    🔴 ${player.number}號・${player.name}
                    ｜${player.role}（死亡）
                </div>

            `;
        }
    }


    aliveList.innerHTML = html;
}


// ====================
// 狼人階段
// ====================

function wolfTurn() {

    const wolves = playerData.filter(

        player =>
            player.role === "狼人" &&
            player.alive

    );


    let wolfNames = "";


    for (const wolf of wolves) {

        wolfNames += `

            <p>
                ${wolf.number}號・${wolf.name}
            </p>

        `;
    }


    document.getElementById("game").innerHTML = `

        <h2>🐺 狼人請睜眼</h2>

        <p>
            狼人玩家：
        </p>

        ${wolfNames}

        <button onclick="showWolfTargets()">
            開始選擇目標
        </button>

    `;
}


// ====================
// 顯示狼人目標
// ====================

function showWolfTargets() {

    let html = `

        <h2>🐺 狼人選擇目標</h2>

        <p>
            請選擇今晚要襲擊的玩家：
        </p>

    `;


    for (const player of playerData) {

        if (player.alive) {

            html += `

                <button
                    onclick="wolfAttack(${player.number})"
                >
                    ${player.number}號・${player.name}
                </button>

            `;
        }
    }


    document.getElementById("game").innerHTML =
        html;
}


// ====================
// 狼人選擇目標
// ====================

function wolfAttack(target) {

    const targetPlayer =
        playerData.find(

            player =>
                player.number === target

        );


    if (
        !targetPlayer ||
        !targetPlayer.alive
    ) {

        alert(
            "這名玩家已經死亡，不能選擇！"
        );

        return;
    }


    wolfTarget = target;


    gameHistory.push({

        night: currentNight,

        type: "狼人襲擊",

        text:
            `🐺 第 ${currentNight} 晚：狼人襲擊 ${targetPlayer.number}號・${targetPlayer.name}`

    });


    document.getElementById("game").innerHTML = `

        <h2>☠️ 狼人行動完成</h2>

        <p>
            今晚狼人選擇了：
        </p>

        <h3>
            ${targetPlayer.number}號・${targetPlayer.name}
        </h3>

        <button onclick="witchTurn()">
            🧙 女巫請睜眼
        </button>

    `;
}


// ====================
// 女巫出場
// ====================

function witchTurn() {

    const witch =
        playerData.find(

            player =>
                player.role === "女巫"

        );


    // 沒有女巫
    if (!witch) {

        seerTurn();

        return;
    }


    // 女巫死亡
    if (!witch.alive) {

        document.getElementById("game").innerHTML = `

            <h2>🧙 女巫請睜眼</h2>

            <h3>
                ${witch.number}號・${witch.name}
            </h3>

            <p>
                💀 女巫已死亡，無法使用技能。
            </p>

            <button onclick="seerTurn()">
                ➡️ 繼續
            </button>

        `;

        return;
    }


    // 女巫存活
    document.getElementById("game").innerHTML = `

        <h2>🧙 女巫請睜眼</h2>

        <p>
            女巫玩家：
        </p>

        <h3>
            ${witch.number}號・${witch.name}
        </h3>

        <button onclick="witchSkillTurn()">
            🧪 開始使用技能
        </button>

    `;
}


// ====================
// 女巫技能
// ====================

function witchSkillTurn() {

    const targetPlayer =
        playerData.find(

            player =>
                player.number === wolfTarget

        );


    // 解藥
    let antidoteButton = "";


    if (!antidoteUsed) {

        antidoteButton = `

            <button onclick="useAntidote()">
                🧪 使用解藥
            </button>

        `;

    } else {

        antidoteButton = `

            <p>
                🧪 解藥已使用
            </p>

        `;
    }


    // 毒藥
    let poisonSection = "";


    if (!poisonUsed) {

        poisonSection = `

            <h3>
                ☠️ 毒藥
            </h3>

            <p>
                選擇要毒殺的玩家：
            </p>

            <select id="poisonSelect">

                <option value="">
                    不使用毒藥
                </option>

        `;


        for (const player of playerData) {

            if (player.alive) {

                poisonSection += `

                    <option value="${player.number}">
                        ${player.number}號・${player.name}
                    </option>

                `;
            }
        }


        poisonSection += `

            </select>

            <button onclick="usePoison()">
                確認毒藥
            </button>

        `;

    } else {

        poisonSection = `

            <p>
                ☠️ 毒藥已使用
            </p>

        `;
    }


    document.getElementById("game").innerHTML = `

        <h2>🧙 女巫技能</h2>

        <p>
            今晚被狼人襲擊的是：
        </p>

        <h3>
            ${targetPlayer.number}號・${targetPlayer.name}
        </h3>

        <hr>

        <h3>
            🧪 解藥
        </h3>

        <p>
            要使用解藥救他嗎？
        </p>

        ${antidoteButton}

        <button onclick="skipAntidote()">
            不使用
        </button>

        <hr>

        ${poisonSection}

    `;
}


// ====================
// 使用解藥
// ====================

function useAntidote() {

    antidoteUsed = true;

    antidoteTonight = true;


    const targetPlayer =
        playerData.find(

            player =>
                player.number === wolfTarget

        );


    gameHistory.push({

        night: currentNight,

        type: "女巫解藥",

        text:
            `🧙 女巫使用解藥：救下 ${targetPlayer.number}號・${targetPlayer.name}`

    });


    document.getElementById("game").innerHTML = `

        <h2>🧪 已使用解藥</h2>

        <p>
            ${targetPlayer.number}號・${targetPlayer.name}
            被救活了！
        </p>

        <button onclick="witchSkillTurn()">
            ➡️ 繼續
        </button>

    `;
}


// ====================
// 不使用解藥
// ====================

function skipAntidote() {

    continueAfterWitch();

}


// ====================
// 使用毒藥
// ====================

function usePoison() {

    const select =
        document.getElementById("poisonSelect");


    poisonTarget = select.value;


    // 不使用毒藥
    if (poisonTarget === "") {

        poisonTarget = null;

        continueAfterWitch();

        return;
    }


    poisonUsed = true;


    const targetPlayer =
        playerData.find(

            player =>
                player.number ===
                Number(poisonTarget)

        );


    gameHistory.push({

        night: currentNight,

        type: "女巫毒藥",

        text:
            `☠️ 女巫使用毒藥：毒殺 ${targetPlayer.number}號・${targetPlayer.name}`

    });


    document.getElementById("game").innerHTML = `

        <h2>☠️ 毒藥已使用</h2>

        <p>
            ${targetPlayer.number}號・${targetPlayer.name}
            將被毒殺。
        </p>

        <button onclick="continueAfterWitch()">
            ➡️ 繼續
        </button>

    `;
}


// ====================
// 女巫結束
// ====================

function continueAfterWitch() {

    document.getElementById("game").innerHTML = `

        <h2>🌙 女巫行動結束</h2>

        <button onclick="seerTurn()">
            👁️ 預言家請睜眼
        </button>

    `;
}


// ====================
// 預言家
// ====================

function seerTurn() {

    const seer =
        playerData.find(

            player =>
                player.role === "預言家"

        );


    if (!seer) {

        nightEnd();

        return;
    }


    // 預言家死亡
    if (!seer.alive) {

        document.getElementById("game").innerHTML = `

            <h2>👁️ 預言家請睜眼</h2>

            <h3>
                ${seer.number}號・${seer.name}
            </h3>

            <p>
                💀 預言家已死亡，無法使用技能。
            </p>

            <button onclick="nightEnd()">
                ➡️ 繼續
            </button>

        `;

        return;
    }


    let html = `

        <h2>👁️ 預言家請睜眼</h2>

        <p>
            預言家：
        </p>

        <h3>
            ${seer.number}號・${seer.name}
        </h3>

        <p>
            請選擇要查驗的玩家：
        </p>

    `;


    for (const player of playerData) {

        if (
            player.alive &&
            player.number !== seer.number
        ) {

            html += `

                <button
                    onclick="seerCheck(${player.number})"
                >
                    ${player.number}號・${player.name}
                </button>

            `;
        }
    }


    document.getElementById("game").innerHTML =
        html;
}


// ====================
// 預言家查驗
// ====================

function seerCheck(targetNumber) {

    const targetPlayer =
        playerData.find(

            player =>
                player.number === targetNumber

        );


    let result;


    if (targetPlayer.role === "狼人") {

        result = "🐺 狼人";

    } else {

        result = "😊 好人";

    }


    gameHistory.push({

        night: currentNight,

        type: "預言家查驗",

        text:
            `👁️ 預言家查驗 ${targetPlayer.number}號・${targetPlayer.name}：${result}`

    });


    document.getElementById("game").innerHTML = `

        <h2>🔮 查驗結果</h2>

        <h3>
            ${targetPlayer.number}號・${targetPlayer.name}
        </h3>

        <p>
            身份判定：
        </p>

        <h2>
            ${result}
        </h2>

        <button onclick="nightEnd()">
            🌅 結束夜晚
        </button>

    `;
}


// ====================
// 夜晚結束
// ====================

function nightEnd() {

    resolveNight();

}


// ====================
// 結算夜晚
// ====================

function resolveNight() {

    let deaths = [];


    // ====================
    // 狼人攻擊
    // ====================

    if (
        wolfTarget !== null &&
        antidoteTonight === false
    ) {

        const wolfPlayer =
            playerData.find(

                player =>
                    player.number === wolfTarget

            );


        if (wolfPlayer) {

            deaths.push({

                number: wolfPlayer.number,

                name: wolfPlayer.name,

                reason: "🐺 狼人襲擊"

            });
        }
    }


    // ====================
    // 女巫毒藥
    // ====================

    if (poisonTarget !== null) {

        const poisonPlayer =
            playerData.find(

                player =>
                    player.number ===
                    Number(poisonTarget)

            );


        if (
            poisonPlayer &&
            !deaths.some(
                death =>
                    death.number ===
                    poisonPlayer.number
            )
        ) {

            deaths.push({

                number: poisonPlayer.number,

                name: poisonPlayer.name,

                reason: "☠️ 女巫毒藥"

            });

        } else if (poisonPlayer) {

            // 如果同一晚同一個人同時被狼人和毒藥擊中
            const death =
                deaths.find(

                    death =>
                        death.number ===
                        poisonPlayer.number

                );


            death.reason += "＋☠️ 女巫毒藥";

        }
    }


    // ====================
    // 標記死亡
    // ====================

    for (const death of deaths) {

        const player =
            playerData.find(

                player =>
                    player.number === death.number

            );


        if (player) {

            player.alive = false;
        }
    }


    updateAlivePlayers();


    // ====================
    // 記錄死亡
    // ====================

    for (const death of deaths) {

        gameHistory.push({

            night: currentNight,

            type: "死亡",

            text:
                `💀 ${death.number}號・${death.name} 死亡：${death.reason}`

        });
    }


    // ====================
    // 判定遊戲結束
    // ====================

    if (checkGameEnd()) {

        return;
    }


    // ====================
    // 早上結果
    // ====================

    let resultHTML = `

        <h2>🌅 天亮了</h2>

        <p>
            所有玩家請睜眼。
        </p>

        <hr>

        <h3>
            昨晚結果
        </h3>

    `;


    if (deaths.length === 0) {

        resultHTML += `

            <h2>
                🌙 昨晚是平安夜
            </h2>

        `;

    } else {

        for (const death of deaths) {

            resultHTML += `

                <div>

                    <h3>
                        ${death.number}號・${death.name}
                    </h3>

                    <p>
                        ${death.reason}
                    </p>

                </div>

            `;
        }
    }


    resultHTML += `

        <hr>

        <button onclick="discussionPhase()">
            💬 開始討論
        </button>

    `;


    document.getElementById("game").innerHTML =
        resultHTML;
}


// ====================
// 討論階段
// ====================

function discussionPhase() {

    document.getElementById("game").innerHTML = `

        <h2>💬 討論時間</h2>

        <p>
            請存活玩家開始討論。
        </p>

        <hr>

        <h3>
            👥 目前存活玩家
        </h3>

        <div>
            ${getAlivePlayerNames()}
        </div>

        <br>

        <button onclick="startVoting()">
            🗳️ 討論結束，開始投票
        </button>

    `;
}


// ====================
// 顯示存活玩家
// ====================

function getAlivePlayerNames() {

    let html = "";


    for (const player of playerData) {

        if (player.alive) {

            html += `

                <p>
                    🟢 ${player.number}號・${player.name}
                </p>

            `;
        }
    }


    return html;
}


// ====================
// 判定遊戲結束
// ====================

function checkGameEnd() {

    const aliveWolves =
        playerData.filter(

            player =>
                player.alive &&
                player.role === "狼人"

        );


    const aliveGoodPlayers =
        playerData.filter(

            player =>
                player.alive &&
                player.role !== "狼人"

        );


    // 好人勝利
    if (aliveWolves.length === 0) {

        gameHistory.push({

            type: "遊戲結束",

            text:
                "🎉 好人勝利！所有狼人都已出局。"

        });


        showGameHistory(
            "🎉 好人勝利！"
        );

        return true;
    }


    // 狼人勝利
    if (
        aliveWolves.length >=
        aliveGoodPlayers.length
    ) {

        gameHistory.push({

            type: "遊戲結束",

            text:
                "🐺 狼人勝利！狼人數量已不少於好人。"

        });


        showGameHistory(
            "🐺 狼人勝利！"
        );

        return true;
    }


    return false;
}


// ====================
// 開始投票
// ====================

function startVoting() {

    // 每一輪重新計票
    votes = {};


    let html = `

        <h2>🗳️ 白天投票</h2>

        <p>
            請選擇要投票的玩家。
        </p>

        <div id="voteButtons">

    `;


    for (const player of playerData) {

        if (player.alive) {

            html += `

                <button
                    onclick="votePlayer(${player.number})"
                >
                    ${player.number}號・${player.name}
                </button>

            `;
        }
    }


    html += `

        </div>

        <hr>

        <div id="voteResult">
            尚未開始投票
        </div>

    `;


    document.getElementById("game").innerHTML =
        html;
}


// ====================
// 投票
// ====================

function votePlayer(targetNumber) {

    if (!votes[targetNumber]) {

        votes[targetNumber] = 0;

    }


    votes[targetNumber]++;


    showVoteResult();
}


// ====================
// 顯示票數
// ====================

function showVoteResult() {

    let html = `

        <h3>
            📊 目前票數
        </h3>

    `;


    for (const player of playerData) {

        if (player.alive) {

            const count =
                votes[player.number] || 0;


            html += `

                <p>
                    ${player.number}號・${player.name}
                    ：${count} 票
                </p>

            `;
        }
    }


    html += `

        <br>

        <button onclick="finishVoting()">
            ✅ 結束投票
        </button>

    `;


    document.getElementById("voteResult").innerHTML =
        html;
}


// ====================
// 結束投票
// ====================

function finishVoting() {

    let highestVotes = 0;

    let eliminatedPlayer = null;

    let tie = false;


    for (const player of playerData) {

        if (!player.alive) {

            continue;

        }


        const count =
            votes[player.number] || 0;


        if (count > highestVotes) {

            highestVotes = count;

            eliminatedPlayer = player;

            tie = false;

        } else if (

            count === highestVotes &&
            count > 0

        ) {

            tie = true;
        }
    }


    // 沒有人投票
    if (highestVotes === 0) {

        gameHistory.push({

            night: currentNight,

            type: "投票",

            text:
                "🗳️ 本輪沒有人獲得票數"

        });


        document.getElementById("game").innerHTML = `

            <h2>🗳️ 投票結束</h2>

            <p>
                沒有人獲得票數。
            </p>

            <button onclick="nextNight()">
                🌙 進入下一晚
            </button>

        `;

        return;
    }


    // 平票
    if (tie) {

        gameHistory.push({

            night: currentNight,

            type: "投票",

            text:
                "⚖️ 本輪平票，沒有人被淘汰"

        });


        document.getElementById("game").innerHTML = `

            <h2>🗳️ 投票結束</h2>

            <h3>
                ⚖️ 平票
            </h3>

            <p>
                本輪沒有人被淘汰。
            </p>

            <button onclick="nextNight()">
                🌙 進入下一晚
            </button>

        `;

        return;
    }


    // 淘汰玩家
    eliminatedPlayer.alive = false;


    gameHistory.push({

        night: currentNight,

        type: "投票",

        text:
            `🗳️ ${eliminatedPlayer.number}號・${eliminatedPlayer.name} 被淘汰，獲得 ${highestVotes} 票`

    });


    updateAlivePlayers();


    // 判定遊戲結束
    if (checkGameEnd()) {

        return;
    }


    document.getElementById("game").innerHTML = `

        <h2>💀 投票結果</h2>

        <h3>
            ${eliminatedPlayer.number}號・${eliminatedPlayer.name}
        </h3>

        <p>
            以 ${highestVotes} 票被淘汰。
        </p>

        <button onclick="nextNight()">
            🌙 進入下一晚
        </button>

    `;
}


// ====================
// 進入下一晚
// ====================

function nextNight() {

    currentNight++;

    wolfTarget = null;

    poisonTarget = null;

    antidoteTonight = false;


    document.getElementById("game").innerHTML = `

        <h2>🌙 第 ${currentNight} 晚</h2>

        <p>
            天黑請閉眼。
        </p>

        <button onclick="wolfTurn()">
            🐺 狼人請睜眼
        </button>

    `;
}


// ====================
// 顯示全局戰績
// ====================

function showGameHistory(result) {

    let historyHTML = `

        <h2>🏆 遊戲結束</h2>

        <h2>
            ${result}
        </h2>

        <hr>

        <h2>
            📜 全局戰績
        </h2>

    `;


    if (gameHistory.length === 0) {

        historyHTML += `

            <p>
                尚無戰績。
            </p>

        `;

    } else {

        let lastNight = null;


        for (const record of gameHistory) {

            if (
                record.night !== undefined &&
                record.night !== lastNight
            ) {

                historyHTML += `

                    <h3>
                        🌙 第 ${record.night} 晚
                    </h3>

                `;

                lastNight = record.night;
            }


            historyHTML += `

                <p>
                    ${record.text}
                </p>

            `;
        }
    }


    historyHTML += `

        <hr>

        <h2>
            👥 最終玩家狀態
        </h2>

    `;


    for (const player of playerData) {

        if (player.alive) {

            historyHTML += `

                <p>
                    🟢 ${player.number}號・${player.name}
                    ｜${player.role}
                    ｜存活
                </p>

            `;

        } else {

            historyHTML += `

                <p>
                    🔴 ${player.number}號・${player.name}
                    ｜${player.role}
                    ｜死亡
                </p>

            `;
        }
    }


    historyHTML += `

        <hr>

        <button onclick="location.reload()">
            🔄 重新開始遊戲
        </button>

    `;


    document.getElementById("game").innerHTML =
        historyHTML;
}
