import { PREFIX } from "../../../config.js";
import crypto from "node:crypto";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const FILMES_DIR = path.resolve("./tmp/obsidian-filmes");

// ---------------------------------------------------------
// CONFIGURAÇÃO
// ---------------------------------------------------------

// Vídeo público apenas para TESTE.
// Não é YouTube e não é filme protegido.
const TEST_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const VIDEO_FILE = path.join(FILMES_DIR, "teste.mp4");

// ---------------------------------------------------------
// GARANTE A PASTA
// ---------------------------------------------------------

async function ensureDir() {
  await fsp.mkdir(FILMES_DIR, {
    recursive: true
  });
}

// ---------------------------------------------------------
// BAIXA O MP4
// ---------------------------------------------------------

async function downloadVideo(url, destination) {
  await ensureDir();

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Falha ao baixar vídeo: HTTP ${response.status}`
    );
  }

  if (!response.body) {
    throw new Error("A resposta não possui corpo.");
  }

  const tempFile = `${destination}.download`;

  try {
    const fileStream = fs.createWriteStream(tempFile);

    await pipeline(
      Readable.fromWeb(response.body),
      fileStream
    );

    await fsp.rename(tempFile, destination);
  } catch (error) {
    try {
      await fsp.unlink(tempFile);
    } catch {}

    throw error;
  }
}

// ---------------------------------------------------------
// DOWNLOAD SOMENTE SE NECESSÁRIO
// ---------------------------------------------------------

async function ensureTestVideo() {
  try {
    const stat = await fsp.stat(VIDEO_FILE);

    if (stat.isFile() && stat.size > 1024) {
      return;
    }
  } catch {}

  console.log("[FILME] Baixando vídeo de teste...");

  await downloadVideo(
    TEST_VIDEO,
    VIDEO_FILE
  );

  const stat = await fsp.stat(VIDEO_FILE);

  console.log(
    `[FILME] Vídeo baixado: ${stat.size} bytes`
  );
}

// ---------------------------------------------------------
// HTML DO PLAYER
// ---------------------------------------------------------

function buildFilmeHtml(baseUrl) {
  const videoUrl =
    `${baseUrl}/filme-video/teste.mp4`;

  return String.raw`
<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width,initial-scale=1.0"
>

<title>OBSIDIAN FILMES</title>

<style>

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  background: #050505;
  color: #fff;
  font-family: Arial, sans-serif;
}

body {
  min-height: 100vh;
  padding: 18px;
}

.container {
  width: 100%;
  max-width: 900px;
  margin: auto;
}

.card {
  background:
    linear-gradient(
      145deg,
      #151515,
      #080808
    );

  border: 1px solid #292929;

  border-radius: 22px;

  overflow: hidden;

  box-shadow:
    0 15px 50px rgba(0,0,0,.55);
}

.header {
  padding: 20px;
}

.logo {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 2px;
}

.subtitle {
  margin-top: 6px;
  color: #999;
  font-size: 13px;
}

.player {
  width: 100%;
  background: #000;
}

.player video {
  display: block;

  width: 100%;

  height: auto;

  max-height: 70vh;

  background: #000;

  touch-action: manipulation;
}

.info {
  padding: 18px 20px 22px;
}

.title {
  font-size: 20px;
  font-weight: 800;
}

.status {
  margin-top: 8px;
  color: #888;
  font-size: 13px;
}

.buttons {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  margin-top: 18px;
}

button {
  border: 0;

  border-radius: 12px;

  padding: 12px 16px;

  background: #1d1d1d;

  color: #fff;

  font-weight: 700;

  cursor: pointer;

  touch-action: manipulation;
}

button:active {
  transform: scale(.97);
}

</style>

</head>

<body>

<div class="container">

  <div class="card">

    <div class="header">

      <div class="logo">
        OBSIDIAN FILMES
      </div>

      <div class="subtitle">
        Player HTML5
      </div>

    </div>

    <div class="player">

      <video
        id="video"
        controls
        playsinline
        webkit-playsinline
        preload="metadata"
      >

        <source
          src="${videoUrl}"
          type="video/mp4"
        >

        Seu dispositivo não suporta
        reprodução de vídeo HTML5.

      </video>

    </div>

    <div class="info">

      <div class="title">
        Big Buck Bunny — TESTE
      </div>

      <div
        id="status"
        class="status"
      >
        Preparando vídeo...
      </div>

      <div class="buttons">

        <button id="play">
          ▶ Reproduzir
        </button>

        <button id="pause">
          ⏸ Pausar
        </button>

        <button id="restart">
          ↻ Reiniciar
        </button>

      </div>

    </div>

  </div>

</div>

<script>

(function() {

  const video =
    document.getElementById("video");

  const status =
    document.getElementById("status");

  const play =
    document.getElementById("play");

  const pause =
    document.getElementById("pause");

  const restart =
    document.getElementById("restart");


  function setStatus(text) {
    if (status) {
      status.textContent = text;
    }
  }


  video.addEventListener(
    "loadstart",
    function() {
      setStatus("Carregando vídeo...");
    }
  );


  video.addEventListener(
    "loadedmetadata",
    function() {

      const duration =
        Number.isFinite(video.duration)
          ? Math.round(video.duration)
          : 0;

      setStatus(
        duration
          ? "Vídeo pronto — " + duration + " segundos"
          : "Vídeo pronto"
      );

    }
  );


  video.addEventListener(
    "canplay",
    function() {
      setStatus("Pronto para reproduzir.");
    }
  );


  video.addEventListener(
    "playing",
    function() {
      setStatus("▶ Reproduzindo");
    }
  );


  video.addEventListener(
    "pause",
    function() {

      if (!video.ended) {
        setStatus("⏸ Pausado");
      }

    }
  );


  video.addEventListener(
    "waiting",
    function() {
      setStatus("⏳ Carregando...");
    }
  );


  video.addEventListener(
    "ended",
    function() {
      setStatus("✓ Reprodução finalizada");
    }
  );


  video.addEventListener(
    "error",
    function() {

      console.error(
        "[OBSIDIAN FILMES]",
        video.error
      );

      setStatus(
        "❌ Erro ao reproduzir o vídeo."
      );

    }
  );


  play.addEventListener(
    "click",
    function() {

      video.play().catch(
        function(error) {

          console.error(
            "Erro ao reproduzir:",
            error
          );

          setStatus(
            "Toque novamente no botão reproduzir."
          );

        }
      );

    }
  );


  pause.addEventListener(
    "click",
    function() {
      video.pause();
    }
  );


  restart.addEventListener(
    "click",
    function() {

      video.currentTime = 0;

      video.play().catch(
        function() {}
      );

    }
  );


})();

</script>

</body>

</html>
`;
}

// ---------------------------------------------------------
// ROTA DO PLAYER
// ---------------------------------------------------------

export function setupFilmeRoutes(app) {

  // -------------------------------------------------------
  // PLAYER HTML
  // -------------------------------------------------------

  app.get(
    "/filme-player",
    async (req, res) => {

      try {

        await ensureTestVideo();

        const host =
          req.get("host");

        const protocol =
          req.headers["x-forwarded-proto"] ||
          req.protocol;

        const baseUrl =
          `${protocol}://${host}`;

        const html =
          buildFilmeHtml(baseUrl);

        res.status(200);

        res.setHeader(
          "Content-Type",
          "text/html; charset=utf-8"
        );

        res.setHeader(
          "Cache-Control",
          "no-store"
        );

        res.send(html);

      } catch (error) {

        console.error(
          "[FILME PLAYER]",
          error
        );

        res.status(500).send(
          "Erro ao preparar o player."
        );

      }

    }
  );


  // -------------------------------------------------------
  // SERVIDOR DO MP4
  //
  // COM SUPORTE A RANGE
  // -------------------------------------------------------

  app.get(
    "/filme-video/teste.mp4",
    async (req, res) => {

      try {

        await ensureTestVideo();

        const stat =
          await fsp.stat(VIDEO_FILE);

        const fileSize =
          stat.size;

        const range =
          req.headers.range;


        // -----------------------------------------------
        // SEM RANGE
        // -----------------------------------------------

        if (!range) {

          res.status(200);

          res.setHeader(
            "Content-Type",
            "video/mp4"
          );

          res.setHeader(
            "Content-Length",
            fileSize
          );

          res.setHeader(
            "Accept-Ranges",
            "bytes"
          );

          res.setHeader(
            "Cache-Control",
            "public, max-age=3600"
          );

          fs.createReadStream(
            VIDEO_FILE
          ).pipe(res);

          return;
        }


        // -----------------------------------------------
        // RANGE
        // -----------------------------------------------

        const match =
          range.match(
            /bytes=(\d*)-(\d*)/
          );


        if (!match) {

          res.status(416);

          res.setHeader(
            "Content-Range",
            `bytes */${fileSize}`
          );

          res.end();

          return;
        }


        let start =
          match[1]
            ? parseInt(match[1], 10)
            : 0;


        let end =
          match[2]
            ? parseInt(match[2], 10)
            : fileSize - 1;


        if (
          Number.isNaN(start) ||
          Number.isNaN(end) ||
          start >= fileSize ||
          start > end
        ) {

          res.status(416);

          res.setHeader(
            "Content-Range",
            `bytes */${fileSize}`
          );

          res.end();

          return;
        }


        end =
          Math.min(
            end,
            fileSize - 1
          );


        const chunkSize =
          end - start + 1;


        res.status(206);

        res.setHeader(
          "Content-Type",
          "video/mp4"
        );

        res.setHeader(
          "Content-Length",
          chunkSize
        );

        res.setHeader(
          "Content-Range",
          `bytes ${start}-${end}/${fileSize}`
        );

        res.setHeader(
          "Accept-Ranges",
          "bytes"
        );

        res.setHeader(
          "Cache-Control",
          "public, max-age=3600"
        );


        const stream =
          fs.createReadStream(
            VIDEO_FILE,
            {
              start,
              end
            }
          );


        stream.on(
          "error",
          (error) => {

            console.error(
              "[FILME VIDEO]",
              error
            );

            if (!res.headersSent) {
              res.status(500);
            }

            res.end();

          }
        );


        req.on(
          "close",
          () => {
            stream.destroy();
          }
        );


        stream.pipe(res);

      } catch (error) {

        console.error(
          "[FILME VIDEO]",
          error
        );

        if (!res.headersSent) {
          res.status(500);
        }

        res.end(
          "Erro ao servir vídeo."
        );

      }

    }
  );

}

// ---------------------------------------------------------
// RICH RESPONSE
// ---------------------------------------------------------

function buildFilmeRichResponse(html) {

  return {

    botForwardedMessage: {

      message: {

        richResponseMessage: {

          submessages: [

            {

              messageType: 2,

              messageText:
                "OBSIDIAN FILMES"

            }

          ],

          messageType: 1,

          unifiedResponse: {

            data: Buffer.from(

              JSON.stringify({

                response_id:
                  crypto.randomUUID(),

                sections: [

                  {

                    view_model: {

                      primitive: {

                        __typename:
                          "GenAIaeacdsnwHtmlPrimitive",

                        payload: html,

                        trusted_sources: [
                          "nixel.dev"
                        ]

                      },

                      __typename:
                        "GenAISingleLayoutViewModel"

                    }

                  }

                ]

              }),

              "utf8"

            )

          },

          contextInfo: {

            mentionedJid: [],

            groupMentions: [],

            statusAttributions: [],

            forwardingScore: 1,

            isForwarded: true,

            forwardedAiBotMessageInfo: {

              botJid:
                "867051314767696@bot"

            },

            forwardOrigin: 4

          }

        }

      }

    }

  };

}

// ---------------------------------------------------------
// COMANDO
// ---------------------------------------------------------

export default {

  name: "filme",

  description:
    "Baixa um vídeo de teste e abre no player HTML5.",

  commands: [
    "filme",
    "video",
    "assistir"
  ],

  usage:
    `${PREFIX}filme`,

  handle: async ({
    socket,
    remoteJid,
    sendSuccessReact,
    sendErrorReply
  }) => {

    try {

      console.log(
        "[FILME] Preparando vídeo..."
      );

      await ensureTestVideo();

      /*
       * IMPORTANTE:
       *
       * Troque pelo domínio público
       * do seu servidor.
       *
       * Exemplo:
       *
       * https://nixel.dev
       */

      const baseUrl =
        "https://nixel.dev";

      const html =
        buildFilmeHtml(baseUrl);

      const richResponse =
        buildFilmeRichResponse(html);

      await socket.relayMessage(
        remoteJid,
        richResponse,
        {}
      );

      await sendSuccessReact();

    } catch (error) {

      console.error(
        "[FILME]",
        error
      );

      await sendErrorReply(
        "Não consegui preparar o vídeo de teste."
      );

    }

  }

};