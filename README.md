# •Projeto InfinityBotChat• 
<img src="https://www.canny-creative.com/wp-content/uploads/2022/01/247310866_1564095240610404_904982525171753308_n-1.gif">

# -Esse projeto consistiu em usar o modelo LLAMA 2🦙 da Meta, para criar um chatbot com respostas coerentes, utilizando das seguintes tecnologias abaixo:  

<ul>
   <li>HTML <img height="30" width="30" src="https://icons.iconarchive.com/icons/cornmanthe3rd/plex/512/Other-html-5-icon.png"></li>
   <li>CSS <img height="25" width="25" src="https://seeklogo.com/images/C/css-3-logo-023C1A7171-seeklogo.com.png"></li>
   <li>JavaScript <img height="25" width="25" src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"></li>
   <li>Node.js <img height="25" width="25" src="https://imgs.search.brave.com/mt3_ltFUor3sJTiWHdmFbORv1QE3PUtM9gsygWvKgFQ/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zZWVr/bG9nby5jb20vaW1h/Z2VzL04vbm9kZWpz/LWxvZ28tRkJFMTIy/RTM3Ny1zZWVrbG9n/by5jb20ucG5n"></li>
</ul>

<h3>•Para criar o ChatBot, a seleção do modelo precisou ser cautelosa, devido há alguns testes não terem ficados tão claros com as repostas dadas pela IA, já que é um modelo recente feito pela Meta, o modelo usado em questão foi o Llama2-7b-Q8, 
que é a versão mais recente baseada no modelo 7B, o processo consistiu em baixar o modelo, e transferir para uma pasta chamada Models, onde importamos no nosso arquivo app.js, como houve integração com Front-End juntamente com Back-End devido as regras de negócio, 
utilizou-se do framework Express para fazer esse processo de uma forma mais simplificada, o modelo anteriormente foi testado apenas com chamadas de API de um serviço chamado Replicate, porém houve bastante inconsistência nos dados recebidos do modelo hospedado, 
devido a isso, optou-se por testar o modelo localmente sem muitos problemas na aplicação</h3>

# Clique [aqui](https://www.youtube.com/watch?v=6TIxSdrFl8w) para assistir ao vídeo de teste do modelo (Duração: 3.54).

# -Estrutura Back-End (app.js)
```Node.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const MODEL_NAME = 'llama-2-7b-chat.Q8_0.gguf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const modelsDirectory = path.join(__dirname, '../models');
const modelsPath = path.join(modelsDirectory, MODEL_NAME);

const model = new LlamaModel({
  modelPath: modelsPath,
});

const context = new LlamaContext({ model });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  const session = new LlamaChatSession({ context });

  const response = await session.prompt(userMessage);

  res.json({
      text: response,
      isBot: true,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
```
# -Estrutura do Front-End (HTML)
```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="/css/style.css"/>
</head>
<body>
    <div class="container-fluid h-100">
        <div class="row justify-content-center h-100">      
            <div class="col-md-8 col-xl-6 chat">
                <div class="card">
                    <div class="card-header msg_head">
                        <div class="d-flex bd-highlight">
                            <div class="img_cont">
                                <img src="https://pngimg.com/uploads/symbol_infinity/symbol_infinity_PNG35.png" class="rounded-circle user_img">
                                <span class="online_icon"></span>
                            </div>
                            <div class="user_info">
                                <span>InfinityChatBot</span>
                                <p>Ask me anything!</p>
                            </div>
                        </div>
                    </div>
                    <div id="messageFormeight" class="card-body msg_card_body">
                    </div>
                    <div class="card-footer">
                        <form id="messageArea" class="input-group">
                            <input type="text" id="text" name="message" placeholder="Type your message..." autocomplete="off" class="form-control type_msg" required/>
                            <div class="input-group-append">
                                <button type="submit" id="send" class="input-group-text send_btn"><i class="fas fa-location-arrow"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
    <script>
        $(document).ready(function() {
            $("#messageArea").on("submit", function(event) {
                const date = new Date();
                const hour = date.getHours();
                const minute = date.getMinutes();
                const str_time = hour + ":" + minute;
                var rawText = $("#text").val();
    
                var userHtml = '<div class="d-flex justify-content-end mb-4"><div class="msg_cotainer_send">' + rawText + '<span class="msg_time_send">' + str_time + '</span></div><div class="img_cont_msg"><img src="https://i.ibb.co/d5b84Xw/Untitled-design.png" class="rounded-circle user_img_msg"></div></div>';
    
                $("#text").val("");
                $("#messageFormeight").append(userHtml);
    
                $.ajax({
                    type: "POST",
                    url: "/message",        
                    contentType: "application/json",
                    data: JSON.stringify({ message: rawText }),
                }).done(function(data) {
                    var botHtml = '<div class="d-flex justify-content-start mb-4"><div class="img_cont_msg"><img src="https://pngimg.com/uploads/symbol_infinity/symbol_infinity_PNG35.png" class="rounded-circle user_img_msg"></div><div class="msg_cotainer">' + data.text + '<span class="msg_time">' + str_time + '</span></div></div>';
                    $("#messageFormeight").append($.parseHTML(botHtml));
                });
                event.preventDefault();
            });
        });
    </script>
</body>
</html>
```

# -Estrutura do Front-End (CSS)
```CSS
body,html{
	height: 100%;
	margin: 0;
	background: rgb(44, 47, 59);
   background: -webkit-linear-gradient(to right, rgb(47, 116, 116), rgb(24, 58, 102), rgb(23, 23, 119));
	background: linear-gradient(to right, rgb(19, 34, 104), rgb(25, 33, 145), rgb(27, 66, 126));
}

.chat{
	margin-top: auto;
	margin-bottom: auto;
}
.card{
	height: 500px;
	border-radius: 15px !important;
	background-color: rgba(0,0,0,0.4) !important;
}
.contacts_body{
	padding:  0.75rem 0 !important;
	overflow-y: auto;
	white-space: nowrap;
}
.msg_card_body{
	overflow-y: auto;
}
.card-header{
	border-radius: 15px 15px 0 0 !important;
	border-bottom: 0 !important;
}
.card-footer{
border-radius: 0 0 15px 15px !important;
	border-top: 0 !important;
}
.container{
	align-content: center;
}
.search{
	border-radius: 15px 0 0 15px !important;
	background-color: rgba(0,0,0,0.3) !important;
	border:0 !important;
	color:white !important;
}
.search:focus{
	 box-shadow:none !important;
   outline:0px !important;
}
.type_msg{
	background-color: rgba(0,0,0,0.3) !important;
	border:0 !important;
	color:white !important;
	height: 60px !important;
	overflow-y: auto;
}
	.type_msg:focus{
	 box-shadow:none !important;
   outline:0px !important;
}
.attach_btn{
	border-radius: 15px 0 0 15px !important;
	background-color: rgba(0,0,0,0.3) !important;
	border:0 !important;
	color: white !important;
	cursor: pointer;
}
.send_btn{
	border-radius: 0 15px 15px 0 !important;
	background-color: rgba(0,0,0,0.3) !important;
	border:0 !important;
	color: white !important;
	cursor: pointer;
}
.search_btn{
	border-radius: 0 15px 15px 0 !important;
	background-color: rgba(0,0,0,0.3) !important;
	border:0 !important;
	color: white !important;
	cursor: pointer;
}
.contacts{
	list-style: none;
	padding: 0;
}
.contacts li{
	width: 100% !important;
	padding: 5px 10px;
	margin-bottom: 15px !important;
}
.active{
	background-color: rgba(0,0,0,0.3);
}
.user_img{
	height: 70px;
	width: 70px;
	border:1.5px solid #f5f6fa;

}
.user_img_msg{
	height: 40px;
	width: 40px;
	border:1.5px solid #f5f6fa;

}
.img_cont{
	position: relative;
	height: 70px;
	width: 70px;
}
.img_cont_msg{
	height: 40px;
	width: 40px;
}
.online_icon{
	position: absolute;
	height: 15px;
	width:15px;
	background-color: #4cd137;
	border-radius: 50%;
	bottom: 0.2em;
	right: 0.4em;
	border:1.5px solid white;
}
.offline{
	background-color: #c23616 !important;
}
.user_info{
	margin-top: auto;
	margin-bottom: auto;
	margin-left: 15px;
}
.user_info span{
	font-size: 20px;
	color: white;
}
.user_info p{
	font-size: 10px;
	color: rgba(255,255,255,0.6);
}
.video_cam{
	margin-left: 50px;
	margin-top: 5px;
}
.video_cam span{
	color: white;
	font-size: 20px;
	cursor: pointer;
	margin-right: 20px;
}
.msg_cotainer{
	margin-top: auto;
	margin-bottom: auto;
	margin-left: 10px;
	border-radius: 25px;
	background-color: rgb(82, 172, 255);
	padding: 10px;
	position: relative;
}
.msg_cotainer_send{
	margin-top: auto;
	margin-bottom: auto;
	margin-right: 10px;
	border-radius: 25px;
	background-color: #58cc71;
	padding: 10px;
	position: relative;
}
.msg_time{
	position: absolute;
	left: 0;
	bottom: -15px;
	color: rgba(255,255,255,0.5);
	font-size: 10px;
}
.msg_time_send{
	position: absolute;
	right:0;
	bottom: -15px;
	color: rgba(255,255,255,0.5);
	font-size: 10px;
}
.msg_head{
	position: relative;
}
#action_menu_btn{
	position: absolute;
	right: 10px;
	top: 10px;
	color: white;
	cursor: pointer;
	font-size: 20px;
}
.action_menu{
	z-index: 1;
	position: absolute;
	padding: 15px 0;
	background-color: rgba(0,0,0,0.5);
	color: white;
	border-radius: 15px;
	top: 30px;
	right: 15px;
	display: none;
}
.action_menu ul{
	list-style: none;
	padding: 0;
	margin: 0;
}
.action_menu ul li{
	width: 100%;
	padding: 10px 15px;
	margin-bottom: 5px;
}
.action_menu ul li i{
	padding-right: 10px;
}
.action_menu ul li:hover{
	cursor: pointer;
	background-color: rgba(0,0,0,0.2);
}
@media(max-width: 576px){
	.contacts_card{
	margin-bottom: 15px !important;
}
}
```
