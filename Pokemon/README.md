# Pokemon Game - Angular 17

Um jogo interativo de adivinhação de Pokemon desenvolvido em Angular 17, utilizando a API do [PokeAPI](https://pokeapi.co/).

## 🎮 Como Jogar

1. **Objetivo**: Adivinhar o nome do Pokemon mostrado na imagem
2. **Pontuação**: 
   - ✅ Acerto sem dica: +20 pontos
   - 💡 Cada dica usada: -5 pontos
3. **Duração**: 10 rodadas por jogo
4. **Dicas**: Clique em "Pedir Dica" para receber informações sobre o Pokemon

## 🚀 Tecnologias Utilizadas

- **Angular 17** - Framework principal
- **NgRx** - Gerenciamento de estado
- **Angular Material** - Componentes de UI
- **Signals** - Reatividade moderna do Angular
- **FormBuilder** - Validação de formulários
- **PokeAPI** - API de dados dos Pokemon

## 📋 Funcionalidades

### ✅ Implementadas
- [x] Interface dinâmica com Angular Material
- [x] Sistema de pontuação (20 pontos por acerto, -5 por dica)
- [x] 10 rodadas por jogo
- [x] Dicas dinâmicas (tipo, altura, peso, habilidades)
- [x] Validação de formulários com FormBuilder
- [x] Gerenciamento de estado com NgRx
- [x] Uso de Signals para reatividade
- [x] Design responsivo
- [x] Feedback visual (snackbars)
- [x] Tela de resultados finais
- [x] Loading states
- [x] Error handling

### 🎯 Características Técnicas

#### NgRx Store
- **Actions**: Gerenciamento de ações do jogo
- **Reducers**: Lógica de estado
- **Effects**: Side effects (chamadas à API)
- **Selectors**: Seleção de dados do estado

#### Signals
- Reatividade moderna do Angular 17
- Computed signals para valores derivados
- Integração com NgRx através de observables

#### Angular Material
- Cards para layout principal
- Form fields com validação
- Progress bar para indicar progresso
- Chips para exibir estatísticas
- Snackbars para feedback
- Buttons com ícones

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd Pokemon

# Instale as dependências
npm install

# Execute o projeto
npm start
```

### Scripts Disponíveis
```bash
# Desenvolvimento
npm start

# Build de produção
npm run build

# Testes
npm test

# Build com watch
npm run watch
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   └── pokemon-game.component.ts
│   │   └── pokemon-game.component.html
│   │   └── pokemon-game.component.scss
│   ├── models/
│   │   └── pokemon.model.ts
│   ├── services/
│   │   └── pokemon.service.ts
│   ├── store/
│   │   ├── actions/
│   │   │   └── pokemon.actions.ts
│   │   ├── effects/
│   │   │   └── pokemon.effects.ts
│   │   ├── reducers/
│   │   │   └── pokemon.reducer.ts
│   │   └── selectors/
│   │       └── pokemon.selectors.ts
│   ├── app.component.ts
│   ├── app.component.html
│   └── app.config.ts
├── styles.scss
└── main.ts
```

## 🎨 Design System

### Cores
- **Primary**: Azure Blue (#2196f3)
- **Accent**: Pink (#e91e63)
- **Success**: Green (#4caf50)
- **Error**: Red (#f44336)
- **Warning**: Orange (#ff9800)

### Componentes
- Cards com sombras suaves
- Progress bar para indicar progresso
- Chips para estatísticas
- Form fields com validação
- Buttons com ícones do Material Design

## 🔧 Configuração

### Angular Material
O projeto utiliza o tema Azure/Blue do Angular Material, configurado no `styles.scss`.

### NgRx DevTools
O Redux DevTools está habilitado para desenvolvimento, permitindo inspecionar o estado da aplicação.

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona bem em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🎯 Regras do Jogo

1. **Início**: O jogo carrega automaticamente um Pokemon aleatório
2. **Adivinhação**: Digite o nome do Pokemon no campo de texto
3. **Validação**: O nome deve ter pelo menos 1 caractere
4. **Pontuação**: 
   - Acerto: +20 pontos
   - Dica: -5 pontos
5. **Dicas**: Clique em "Pedir Dica" para receber informações
6. **Progresso**: 10 rodadas por jogo
7. **Resultado**: Ao final, veja sua pontuação total e acertos

## 🚀 Melhorias Futuras

- [ ] Modo multiplayer
- [ ] Diferentes categorias (por geração, tipo, etc.)
- [ ] Sistema de ranking
- [ ] Modo difícil (sem imagens)
- [ ] Sons e animações
- [ ] PWA (Progressive Web App)
- [ ] Modo offline
- [ ] Mais tipos de dicas

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e utiliza a API pública do PokeAPI.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

**Desenvolvido com ❤️ usando Angular 17 e PokeAPI**
