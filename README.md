# huna-site
This is the source code of HUNA website

Demo:
- Link-> 2021.huna.pt

Install:

1ºpasso criar uma aplicação levantando um docker com o que é necessário, iniciar a criação e voltar a apagar o docker.
    - $ mkdir app && cd "$_"
    - $ docker run --rm -v ${PWD}:/app -it node:13.14-alpine sh -c "yarn global add @vue/cli-init && vue init 'quasarframework/quasar-starter-kit' app"

Developing mode:
-yarn quasar dev

Deploy prod:
- yarn quasar build
- Fazer pull da branch em CPANEL

Taks todo:
- Create docker contanier with node, vue and quasar
- Start a simple first page node aplication with vue/quasar
- Build dockerfile
- Build docker compose
- Build page for prodution enviroment
- Create different stages
- Starting development landing page

Other resources:
- https://medium.com/@jwdobken/develop-quasar-applications-with-docker-a19c38d4a6ac
- https://quasar.dev/quasar-cli/developing-spa/deploying
- https://github.com/quasarframework/quasar-awesome#official-community
- https://dev.to/mayank091193/personal-website-made-using-vue-js-and-quasar-framework-40bf
- https://github.com/smolinari/quasar-docker#initializing-a-new-project
- https://www.linkedin.com/pulse/site-da-comunidade-vuejs-de-bh-quasar-docker-figueiredo-gon%C3%A7alves/

