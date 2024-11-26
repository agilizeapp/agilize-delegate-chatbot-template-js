// src/app.js

const express = require("express");

const app = express();
const port = process.env.PORT || 4444;

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Rota POST para processamento de JSON
app.post("/processMessage", (req, res) => {
  try {
    // Recebe os dados enviados no corpo da requisição
    const requestData = req.body;

    console.log("requestData", requestData);

    const { NAME, PLAN } = requestData.vars;

    const messages = [];

    const askOptions =
      requestData.seq === 1

    const setVars = {}

    let keepHere = true

    if (askOptions) {
      // Mensagem de texto simples
      const text = `Olá ${NAME}! Tudo bem? Você escolheu o plano ${PLAN}. 
                
                Se quiser saber mais sobre este plano acesse o link: https://agilize.app/?test=${PLAN}`;

      messages.push({
        text,
      });

      // Mensagem com anexo PDF
      messages.push({
        text: "Segue arquivo em PDF",
        file: {
          mimetype: "application/pdf",
          fileUrl: "https://pdfobject.com/pdf/sample.pdf",
        },
      });

      // Mensagem com anexo de imagem
      messages.push({
        text: "Segue imagem:",
        file: {
          mimetype: "image/png",
          fileUrl:
            "https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png",
        },
      });

      // Mensagem com botões
      messages.push({
        text: "Escolha a opção a seguir",
        buttons: { 0: "Opção A", 1: "Opção B" },
      });
    } else {
     keepHere = false // Vai finalizar o processamento interno e continuar o fluxo na plataforma
      messages.push({
        text: `Obrigado por informar sua opção, continuando fluxo pela plataforma.`,
      });

      setVars['OPTION_VAL'] = requestData.interactiveReply
    }

    // Definição do objeto de retorno
    const returnData = {
      messages, // Quais mensagens serão enviadas para contato
      keepHere, // Determina que a proxima mensagem será processada por este endpoint
      vars: setVars // Quais variaveis serão salvas para uso no processamento do fluxo
    };

    // Retorna o JSON processado
    res.status(200).json(returnData);
  } catch (error) {
    // Tratamento de erros
    console.error("Erro no processamento:", error.message);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no processamento dos dados.",
    });
  }
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
