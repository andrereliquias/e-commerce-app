# e-commerce-app
## Sobre
Essa aplicação foi baseada na arquitetura de [microserviço serverless](https://docs.aws.amazon.com/whitepapers/latest/serverless-multi-tier-architectures-api-gateway-lambda/microservices-with-lambda.html) que consiste de microserviços que utilizam funções lambdas em conjunto com serverless.

É possível encontrar o contrato da API no caminho: `/src/config/swagger.json`
## Como executar
### Localmente
Para execução local é necessário as seguintes ferramentas:
- [Git](https://git-scm.com/downloads)
- [Docker](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Uma vez instaladas, basta seguir os seguintes passos:
- Clone o repositório 
  ```
  $ git clone git@github.com:AndreReliquias/e-commerce-app.git
  ```
- Na raiz do projeto, execute o Docker Compose
  ```
  $ docker-compose up
  ```
- Para execução dos testes
  ```
  $ docker-compose exec e-commerce-app sh -c "npm run test"
  ```

### Desenvolvimento e Produção
O projeto conta com uma pipeline de CI/CD provida pelo [GitHub Actions](https://github.com/features/actions), dessa forma, todos os _commits_ que forem realizados na _branch_ `main`, serão implantados em produção, e na _branch_ `development`, serão implantados em desenvolvimento, ambos na nuvem da AWS. Caso queira realizar uma implantação fora da pipeline, os seguintes passos são necessários:
- Instale o [serverless framework](https://www.serverless.com/)
  ```
  $ npm install -g serverless
  ```
- Instale as dependências
  ```
  $ npm install
  ```
- Exporte suas credenciais de acesso
  ```
  $ export AWS_ACCESS_KEY_ID=ABC
  $ export AWS_SECRET_ACCESS_KEY=DEF
  ```
- Execute o script para implantação em produção
  ```
  $ npm run deploy-main
  ```
- Execute o script para implantação em desenvolvimento
  ```
  $ npm run deploy-development
  ```
**Observação:** A região padrão é `us-east-1`