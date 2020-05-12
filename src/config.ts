import { ConfigSchema } from "@src/model/config-schema";

const config: ConfigSchema = {
  bot: {
    token: ""
  },
  server: {
    channel: "709067241680797707",
    category: '709064727934009355',
    greeting: `:shark: **Whitelist**
    Seja bem-vindo ao **Seu RP**!
    Para entrar em nossa cidade, você precisa passar por nossa avaliação.
    É uma avaliação rápida, de 12 perguntas das quais você deve acertar ao menos 7.
    
    :triangular_flag_on_post:  Nosso intuito com essa ferramenta é prover uma melhor experiência aos nossos cidadãos.
    
    Não se preocupe, não temos um limite de reprovações.
    Para começar a avaliação, digite \`iniciar\`.`,
    command: "iniciar",
    minScore: 7,
    mysql: {
      host: '127.0.0.1',
      port: 3306,
      user: 'discordbot',
      password: '123',
      db: 'database',
      tableOptions: {
        name: 'vrp_users',
        field: 'whitelisted',
        idField: 'id'
      }
    },
    whitelistFeedbackTimeout: 5000,
    channelDeletionTimeout: 5000,
  },
  whitelist: [
    {
      question: 'O que é RP? (Roleplay)',
      answers: [
        { message: 'É seguir o papel do personagem dentro do jogo', correct: true },
        { message: 'Matar alguém sem uma ação válida e dentro das regras', correct: false },
        { message: 'Utilizar um veículo como arma', correct: false },
        { message: 'Desconectar no meio de uma ação', correct: false },
      ]
    },
    {
      question: 'O que é RDM? (Random Death Match)',
      answers: [
        { message: 'Matar alguém com uma arma', correct: false },
        { message: 'Matar uma pessoa aleatoriamente', correct: true },
        { message: 'Matar alguém sem uma ação válida e dentro das regras', correct: true },
        { message: 'Matar alguém', correct: false },
      ]
    },
    {
      question: 'O que é VDM? (Vehicle Death Match)',
      answers: [
        { message: 'Sair do veículo em movimento', correct: false },
        { message: 'Matar um jogador propositalmente com um veículo', correct: true },
        { message: 'Utilizar um veículo como arma', correct: true },
        { message: 'Destruir o veículo de um jogador sem motivo', correct: false },
      ]
    },
    {
      question: 'Selecione um exemplo de anti-rp:',
      answers: [
        { message: 'Assaltar uma loja sem arma', correct: true },
        { message: 'Atirar em um jogador sem uma ação prévia', correct: true },
        { message: 'Ir até a DP e atirar nos policiais', correct: true },
        { message: 'Roubar um carro em uma área segura', correct: true },
      ]
    },
    {
      question: 'O que é Combat Logging (ou Combat Log)?',
      answers: [
        { message: 'Utilizar informações de fora do jogo', correct: false },
        { message: 'Desconectar no meio de uma ação', correct: true },
        { message: 'Abusar da física do jogo', correct: false },
        { message: 'Destruir o veículo de um jogador sem motivo', correct: false },
      ]
    },
    {
      question: 'Selecione um exemplo de meta-gaming:',
      answers: [
        { message: 'Comunicar-se com meu amigo por meio de uma ferramenta externa', correct: true },
        { message: 'Obter informações privilegiadas de um streamer por meio da sua stream', correct: true },
        { message: 'Assaltar uma loja sem arma', correct: false },
        { message: 'Sair do veículo em movimento', correct: false },
      ]
    },
    {
      question: 'O que é Power Gaming?',
      answers: [
        { message: 'Utilizar informações de fora do jogo', correct: false },
        { message: 'Abusar da física do jogo, fazendo algo que não seria possível na vida real', correct: true },
        { message: 'Roubar um carro em uma área segura', correct: false },
        { message: 'Matar um jogador propositalmente com um veículo', correct: false },
      ]
    },
    {
      question: 'O que é ser finalizado?',
      answers: [
        { message: 'Ficar inconsciente em uma ação e aguardar os médicos chegarem', correct: false },
        { message: 'Ser morto durante uma ação, portanto não posso ser revivido e não lembrarei dos últimos 15 minutos', correct: true },
      ]
    },
    {
      question: 'Uma safe-zone é...',
      answers: [
        { message: 'Uma área onde você pode matar outros jogadores sem iniciar uma ação', correct: false },
        { message: 'Uma área, local ou NPC onde você não pode praticar qualquer tipo de crime', correct: true },
      ]
    },
    {
      question: 'Em que situações é permitido a reprodução de músicas?',
      answers: [
        { message: 'Definitivamente não são permitidos músicas no jogo', correct: false },
        { message: 'Quando você tem um carro, um celular, uma caixa de som ou algo que possa reproduzir música', correct: true },
      ]
    },
    {
      question: 'É permitido desrespeitar outros jogadores?',
      answers: [
        { message: 'Não, todos os jogadores devem ser respeitados', correct: true },
        { message: 'Sim, desde que dentro do roleplay', correct: false },
      ]
    },
    {
      question: 'Para finalizar, selecione qualquer opção:',
      answers: [
        { message: 'Não é permitido qualquer tipo de linguajar perigoso (racismo, xenofobia, homofobia)', correct: true },
        { message: 'Valorize a sua vida como se fosse única', correct: true },
        { message: 'Se alguém aponto uma arma em sua cabeça, você deve seguir o roleplay', correct: true },
        { message: 'Em caso de abuso de bugs, chame um administrador e se possível, grave a cena', correct: true },
        { message: 'Evite trazer coisas da vida real para o jogo. (exemplo: "aperta F5")', correct: true },
        { message: 'Se você viu uma ação de anti-rp, grave e mostre a um administrador', correct: true },
        { message: 'Tenha um bom jogo!', correct: true },
      ]
    },
  ]
};

export default config;
