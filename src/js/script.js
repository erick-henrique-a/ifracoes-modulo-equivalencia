class JogoFracoes {
    constructor() {
        this.faseAtual = 0;
        this.fasesCompletadas = 0;
        this.vigaAtual = [];
        
        // Definição das fases (cada fase tem um alvo em frações)
        this.fases = [
            { numero: 1, alvo: 3/4, descricao: '3/4' },
            { numero: 2, alvo: 1, descricao: '4/4' },
            { numero: 3, alvo: 7/8, descricao: '7/8' },
            { numero: 4, alvo: 11/12, descricao: '11/12' },
            { numero: 5, alvo: 5/8, descricao: '5/8' },
            { numero: 6, alvo: 13/16, descricao: '13/16' },
        ];

        // Tipos de blocos disponíveis
        this.tiposBlocos = [
            { fracao: 1/4, label: '1/4', classe: 'bloco-um-quarto', cor: '#667eea' },
            { fracao: 1/2, label: '1/2', classe: 'bloco-meia', cor: '#f5576c' },
            { fracao: 1/4, label: '1/4', classe: 'bloco-um-quarto', cor: '#667eea' },
            { fracao: 1/8, label: '1/8', classe: 'bloco-um-oitavo', cor: '#00f2fe' },
            { fracao: 1/8, label: '1/8', classe: 'bloco-um-oitavo', cor: '#00f2fe' },
            { fracao: 1/12, label: '1/12', classe: 'bloco-um-doze-avos', cor: '#38f9d7' },
        ];

        this.idProximo = 0;
        this.inicializar();
    }

    inicializar() {
        this.proximaFase();
        this.renderizarBlocos();
        this.configurarDragAndDrop();
    }

    proximaFase() {
        if (this.faseAtual < this.fases.length) {
            this.vigaAtual = [];
            this.atualizarUI();
            this.faseAtual++;
        } else {
            alert('🎉 Parabéns! Você completou todas as fases!');
            this.faseAtual = 0;
            this.fasesCompletadas = 0;
            this.proximaFase();
        }
    }

    renderizarBlocos() {
        const container = document.getElementById('blocos-container');
        container.innerHTML = '';

        this.tiposBlocos.forEach((tipo, index) => {
            const bloco = document.createElement('div');
            bloco.textContent = tipo.label;
            bloco.className = `bloco ${tipo.classe}`;
            bloco.setAttribute('data-fracao', tipo.fracao);
            bloco.setAttribute('data-label', tipo.label);
            bloco.setAttribute('draggable', 'true');
            bloco.setAttribute('data-id', `bloco-modelo-${index}`);
            
            bloco.addEventListener('dragstart', (e) => {
                e.dataTransfer.effectAllowed = 'copy';
                e.dataTransfer.setData('tipo', JSON.stringify({
                    fracao: parseFloat(tipo.fracao),
                    label: tipo.label,
                    classe: tipo.classe
                }));
            });

            container.appendChild(bloco);
        });
    }

    configurarDragAndDrop() {
        const vigaContainer = document.getElementById('viga-container');

        vigaContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            vigaContainer.classList.add('over');
        });

        vigaContainer.addEventListener('dragleave', (e) => {
            if (e.target === vigaContainer) {
                vigaContainer.classList.remove('over');
            }
        });

        vigaContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            vigaContainer.classList.remove('over');

            const dados = JSON.parse(e.dataTransfer.getData('tipo'));
            this.adicionarBlocoAViga(dados.fracao, dados.label, dados.classe);
        });
    }

    adicionarBlocoAViga(fracao, label, classe) {
        this.vigaAtual.push({
            id: this.idProximo++,
            fracao: fracao,
            label: label,
            classe: classe
        });

        this.atualizarUI();
        this.verificarVitoria();
    }

    removerBlocoViga(id) {
        this.vigaAtual = this.vigaAtual.filter(b => b.id !== id);
        this.atualizarUI();
    }

    atualizarUI() {
        const faseAtual = this.fases[this.faseAtual - 1];
        if (!faseAtual) return;

        // Atualizar fase
        document.getElementById('fase-numero').textContent = faseAtual.numero;
        document.getElementById('target-display').textContent = faseAtual.descricao;
        document.getElementById('target-value').textContent = faseAtual.descricao;

        // Atualizar placar
        document.getElementById('placar-valor').textContent = this.fasesCompletadas;

        // Calcular total da viga
        const totalViga = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);

        // Atualizar viga construída
        this.renderizarVigaConstruida(totalViga);

        // Atualizar progresso
        this.atualizarProgresso(totalViga, faseAtual.alvo);

        // Atualizar escala visual
        this.atualizarEscalaVisual(totalViga, faseAtual.alvo);

        // Atualizar status
        this.atualizarStatus(totalViga, faseAtual.alvo);
    }

    renderizarVigaConstruida(total) {
        const vigaConstruida = document.getElementById('viga-construida');
        
        if (this.vigaAtual.length === 0) {
            vigaConstruida.innerHTML = '<div class="placeholder-text">Arraste os blocos aqui para construir!</div>';
            return;
        }

        vigaConstruida.innerHTML = this.vigaAtual.map(bloco => `
            <div class="bloco-colocado ${bloco.classe}" 
                 onclick="game.removerBlocoViga(${bloco.id})"
                 title="Clique para remover">
                ${bloco.label}
            </div>
        `).join('');

        // Adicionar exibição do total
        const totalDiv = document.createElement('div');
        totalDiv.style.marginLeft = '10px';
        totalDiv.style.fontSize = '14px';
        totalDiv.style.fontWeight = 'bold';
        totalDiv.style.color = '#333';
        totalDiv.textContent = `= ${this.formatarFracao(total)}`;
        vigaConstruida.appendChild(totalDiv);
    }

    atualizarProgresso(total, alvo) {
        const progressPercent = Math.min((total / alvo) * 100, 100);
        const preenchimento = document.getElementById('progresso-fill');
        preenchimento.style.width = progressPercent + '%';

        // Atualizar texto do progresso
        const progresso = document.getElementById('progresso-texto');
        progresso.textContent = `${this.formatarFracao(total)}/${this.formatarFracao(alvo)}`;

        // Atualizar percentual
        const percentual = document.getElementById('progresso-percentual');
        if (progressPercent > 15) {
            percentual.textContent = Math.round(progressPercent) + '%';
        } else {
            percentual.textContent = '';
        }
    }

    atualizarEscalaVisual(total, alvo) {
        const escalaVisual = document.getElementById('escala-visual');
        const preenchida = escalaVisual.querySelector('.escala-preenchida');
        const percent = Math.min((total / alvo) * 100, 100);
        preenchida.style.width = percent + '%';

        // Mudar cor se completou
        if (Math.abs(total - alvo) < 0.001) {
            preenchida.style.background = 'linear-gradient(90deg, #51cf66 0%, #40c057 100%)';
        } else if (total > alvo) {
            preenchida.style.background = 'linear-gradient(90deg, #ff6b6b 0%, #ff5252 100%)';
        } else {
            preenchida.style.background = 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
        }
    }

    atualizarStatus(total, alvo) {
        const status = document.getElementById('status-mensagem');
        const diferenca = Math.abs(total - alvo);

        status.className = 'status-mensagem';

        if (diferenca < 0.001) {
            status.textContent = '✅ Perfeito! Você montou a viga corretamente!';
            status.classList.add('sucesso');
        } else if (total > alvo) {
            status.textContent = '⚠️ Você colocou demais! Remova alguns blocos.';
            status.classList.add('quase');
        } else if (total > alvo * 0.75) {
            status.textContent = '⏱️ Quase lá! Continue adicionando blocos.';
            status.classList.add('quase');
        } else {
            status.className = 'status-mensagem';
            status.textContent = '';
        }
    }

    verificarVitoria() {
        console.log("rodando funcao verificarVitoria()");
        const faseAtual = this.fases[this.faseAtual - 1];
        const totalViga = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
        const diferenca = Math.abs(totalViga - faseAtual.alvo);

        if (diferenca < 0.001) {
            this.vitoria();
        }
    }

    vitoria() {
        console.log("rodando funcao vitoria()");
        this.fasesCompletadas++;
        const btnProxima = document.getElementById('btn-proxima');
        btnProxima.classList.add('active');

        const status = document.getElementById('status-mensagem');
        status.textContent = '🎉 Fase Completa! Aperte o botão para continuar!';
        status.className = 'status-mensagem sucesso';
    }

    limpar() {
        this.vigaAtual = [];
        document.getElementById('btn-proxima').classList.remove('active');
        document.getElementById('status-mensagem').className = 'status-mensagem';
        document.getElementById('status-mensagem').textContent = '';
        this.atualizarUI();
    }

    formatarFracao(valor) {
        // Converter decimal para fração aproximada
        const fracoes = [
            { decimal: 1/16, display: '1/16' },
            { decimal: 1/12, display: '1/12' },
            { decimal: 1/8, display: '1/8' },
            { decimal: 1/6, display: '1/6' },
            { decimal: 1/4, display: '1/4' },
            { decimal: 1/3, display: '1/3' },
            { decimal: 3/8, display: '3/8' },
            { decimal: 1/2, display: '1/2' },
            { decimal: 5/8, display: '5/8' },
            { decimal: 2/3, display: '2/3' },
            { decimal: 3/4, display: '3/4' },
            { decimal: 5/6, display: '5/6' },
            { decimal: 7/8, display: '7/8' },
            { decimal: 11/12, display: '11/12' },
            { decimal: 13/16, display: '13/16' },
            { decimal: 1, display: '4/4' }
        ];

        for (let f of fracoes) {
            if (Math.abs(valor - f.decimal) < 0.01) {
                return f.display;
            }
        }

        return valor.toFixed(2);
    }
}

// Inicializar o jogo
const game = new JogoFracoes();
