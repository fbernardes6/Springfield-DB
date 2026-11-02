# Springfield.DB — The Simpsons Character Database

Projeto acadêmico de Web Development Front-End (UniFECAF), desenvolvido com HTML, CSS e JavaScript puro.

## Funcionalidades
- Consumo de API pública usando `fetch`.
- Criação dinâmica de cards com `document.createElement` e `appendChild`.
- Nome, imagem e informação adicional de cada personagem.
- Busca por nome ou descrição.
- Botão para atualizar os dados e carregar mais cards.
- Layout responsivo com tema escuro e detalhes neon.
- Tratamento básico de erros de conexão e imagens indisponíveis.

## API utilizada
Endpoint configurado no `script.js`:
`https://thesimpsonsapi.com/api/characters` (primeira página; API paginada)

A API retorna uma lista paginada em `results`; o total geral vem no campo `count`. As imagens usam o caminho relativo `portrait_path`, completado pelo CDN `https://cdn.thesimpsonsapi.com/500`. A API é um serviço externo e pode sofrer alterações ou indisponibilidade. O projeto inclui tratamento de erro para essa situação.

## Como executar
1. Extraia a pasta do ZIP.
2. Abra a pasta no Visual Studio Code.
3. Inicie um servidor local (por exemplo, a extensão Live Server).
4. Abra o `index.html` pelo servidor local e aguarde o carregamento dos personagens.

> Recomenda-se executar via servidor local, em vez de abrir o arquivo diretamente, e testar a disponibilidade da API antes da apresentação.

## Estrutura
- `index.html` — estrutura da página.
- `style.css` — estilos, responsividade e identidade visual.
- `script.js` — consumo da API, tratamento da resposta e criação dos cards.
