class JogoFracoes {
    constructor() {
        this.faseAtual = 1;
        this.fasesCompletadas = 0;
        this.vigaAtual = [];

                
        // Definição das fases (cada fase tem um alvo em frações)
        this.fases = [
            // Agora cada fase tem seu próprio "estoque" de blocos (array de strings)
            //Teste: {numero: 1, alvo: 1, descricao: '1', estoque: ['1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/9', '1/10'] },
            // Nível 1
            { numero: 1, alvo: 1, descricao: '1', estoque: ['1/2', '1/2', '1/2', '1/2'] },
            { numero: 2, alvo: 1, descricao: '1', estoque: ['1/4', '1/4', '1/4', '1/4', '1/4', '1/4'] },
            { numero: 3, alvo: 3/4, descricao: '3/4', estoque: ['1/4', '1/4', '1/4', '1/4', '1/4'] },
            { numero: 4, alvo: 1/2, descricao: '1/2', estoque: ['1/4', '1/4', '1/4', '1/4'] },
            { numero: 5, alvo: 1, descricao: '1', estoque: ['1/2', '1/4', '1/4','1/4'] },

            //Nível 2: Introduzir 1/8
            { numero: 6, alvo: 1, descricao: '1', estoque: ['1/8', '1/8', '1/8', '1/8','1/8', '1/8', '1/8', '1/8','1/8', '1/8'] },
            { numero: 7, alvo: 1/4, descricao: '1/4', estoque: ['1/2', '1/8', '1/8','1/8'] },
            { numero: 8, alvo: 3/8, descricao: '3/8', estoque: ['1/2', '1/8', '1/8', '1/8','1/8'] },
            { numero: 9, alvo: 1/2, descricao: '1/2', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8'] },          
            { numero: 10, alvo: 1/2, descricao: '1/2', estoque: ['1/4', '1/8', '1/8', '1/8'] },            
            { numero: 11, alvo: 3/4, descricao: '3/4', estoque: ['1/2', '1/4', '1/4', '1/8'] },
            { numero: 12, alvo: 3/8, descricao: '3/8', estoque: ['1/4', '1/8', '1/4', '1/2'] },
            { numero: 13, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8','1/8'] },
            { numero: 14, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/8', '1/4', '1/8', '1/8'] },
            { numero: 15, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/4', '1/4', '1/4'] },
            { numero: 16, alvo: 3/4, descricao: '3/4', estoque: ['1/8', '1/8', '1/2', '1/2'] },
            
            // ... adicione as outras fases seguindo este padrão
            //Nível 3: Introduzir 1/3, 1/6, 1/9

            
        ];

        // Tipos de blocos disponíveis
        this.tiposBlocos = {
            '1/2': { fracao: 1/2, label: '1/2', classe: 'bloco-meia'},
            '1/3': { fracao: 1/3, label: '1/3', classe: 'bloco-um-terco'},
            '1/4': { fracao: 1/4, label: '1/4', classe: 'bloco-um-quarto'},
            '1/5': { fracao: 1/5, label: '1/5', classe: 'bloco-um-quinto'},
            '1/6': { fracao: 1/6, label: '1/6', classe: 'bloco-um-sexto'},
            '1/7': { fracao: 1/7, label: '1/7', classe: 'bloco-um-setimo'},
            '1/8': { fracao: 1/8, label: '1/8', classe: 'bloco-um-oitavo'},
            '1/9': { fracao: 1/9, label: '1/9', classe: 'bloco-um-nono'},
            '1/10': { fracao: 1/10, label: '1/10', classe: 'bloco-um-dez-avos'},
            
        };

        this.fracoesDesbloqueadas = new Set();

        this.idProximo = 0;
        this.criarEstruturaInicialDesbloqueios();
        this.inicializar();
    }

    inicializar() {    
        this.renderizarBlocos();
        this.configurarDragAndDrop();
        this.renderizarDesbloqueios();
        this.atualizarUI();
    }

    proximaFase() {
        if (this.faseAtual < this.fases.length) {
            this.fasesCompletadas++;
            
            // CORREÇÃO: Registra APENAS as frações que estão atualmente construídas na viga
            this.vigaAtual.forEach(bloco => {
                this.fracoesDesbloqueadas.add(bloco.label);
            }); 

            this.renderizarDesbloqueios();
            this.faseAtual++;
            this.vigaAtual = [];
            document.getElementById('btn-proxima').classList.remove('active');
            this.renderizarBlocos();
            this.atualizarUI();
        } else {
            alert('🎉 Parabéns! Você completou todas as fases!');
            this.faseAtual = 1;
            this.fasesCompletadas = 0;
            this.vigaAtual = [];
            document.getElementById('btn-proxima').classList.remove('active');
            this.renderizarBlocos();
            this.atualizarUI();
        }
    }

    renderizarBlocos() {
        const container = document.getElementById('blocos-container');
        container.innerHTML = '<div class="blocos-title">🧱 Blocos Disponíveis</div>';
        
        // Pega a fase atual baseada no índice
        const fase = this.fases[this.faseAtual - 1];
        
        fase.estoque.forEach((chave, index) => {
            const caracteristicas = this.tiposBlocos[chave];
            if (!caracteristicas) return;
            const bloco = document.createElement('div');
            bloco.innerHTML = this.formatarFracaoHTML(caracteristicas.label);
            // Verifica se este bloco específico (pelo índice) já foi para a viga
            const jaUsado = this.vigaAtual.some(b => b.indexOriginal === index);
            bloco.className = `bloco ${caracteristicas.classe} ${jaUsado ? 'usado' : ''}`;
            bloco.style.height = `${caracteristicas.fracao * 80}%`;
            bloco.style.width = '110px';
                
            if (!jaUsado) {
            bloco.setAttribute('draggable', 'true');
            bloco.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('indexEstoque', index);
                e.dataTransfer.setData('chaveBloco', chave);
            });
            }
            container.appendChild(bloco);
        });
    }

    // Criado uma única vez no arranque do jogo para fixar os elementos na tela
    criarEstruturaInicialDesbloqueios() {
        const grid = document.getElementById('desbloqueios-grid');
        if (!grid) return;
        grid.innerHTML = ''; // Limpa apenas na primeira inicialização

        // 1. Bloco Inteiro Fixo Preto (Sempre visível)
        const blocoInteiro = document.createElement('div');
        blocoInteiro.className = 'conquista-item bloco-inteiro-fixo';
        blocoInteiro.innerHTML = `
            <div class="mini-inteiro-container">
                <div class="mini-bloco-divisao cor-inteiro-preto">
                    <div class="mini-texto-wrapper">
                        <span class="texto-inteiro-fixo">1</span>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(blocoInteiro);

        // 2. Lista estática das outras 9 frações mapeadas por ID
        const todasPossiveis = ['1/2', '1/3', '1/4', '1/5', '1/6', '1/7', '1/8', '1/9', '1/10'];

        todasPossiveis.forEach(chave => {
            const containerItem = document.createElement('div');
            // Guardamos a chave da fração no próprio elemento para o encontrar depois
            containerItem.dataset.fracaoChave = chave;
            containerItem.className = 'conquista-item bloqueado';
            containerItem.innerHTML = '<span class="ponto-interrogacao">?</span>';
            containerItem.title = 'Fração trancada';

            grid.appendChild(containerItem);
        });
    }

    // Altera apenas o estado das frações que acabam de ser conquistadas
    renderizarDesbloqueios() {
        // Buscamos apenas os itens que estão marcados como bloqueados atualmente
        const itensBloqueados = document.querySelectorAll('.conquista-item.bloqueado');
        
        itensBloqueados.forEach(containerItem => {
            const chave = containerItem.dataset.fracaoChave;
            
            // Se o jogador acabou de desbloquear esta fração
            if (this.fracoesDesbloqueadas.has(chave)) {
                // Remove o estado de bloqueado e aplica o descoberto
                containerItem.className = 'conquista-item descoberto';
                containerItem.removeAttribute('title');
                
                const denominador = parseInt(chave.split('/')[1]);
                let blocosInternosHTML = `<div class="mini-inteiro-container">`;
                
                for (let i = 0; i < denominador; i++) {
                    const classeCor = this.tiposBlocos[chave]?.classe || '';
                    const textoFormatadoHTML = this.formatarFracaoHTML(chave);
                    
                    blocosInternosHTML += `
                        <div class="mini-bloco-divisao ${classeCor}">
                            <div class="mini-texto-wrapper">
                                ${textoFormatadoHTML}
                            </div>
                        </div>
                    `;
                }
                
                blocosInternosHTML += `</div>`;
                // Insere o conteúdo colorido apenas nesta caixa específica
                containerItem.innerHTML = blocosInternosHTML;
            }
        });
    }

    configurarDragAndDrop() {
        const vigaContainer = document.getElementById('viga-container');
        vigaContainer.addEventListener('dragover', (e) => e.preventDefault());
        vigaContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const index = parseInt(e.dataTransfer.getData('indexEstoque'));
            const chave = e.dataTransfer.getData('chaveBloco');
            const caracteristicas = this.tiposBlocos[chave];

            this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
            this.renderizarBlocos();
        });
    }

    adicionarBlocoAViga(fracao, label, classe, indexOriginal) {
        this.vigaAtual.push({
            id: this.idProximo++,
            fracao: fracao,
            label: label,
            classe: classe,
            indexOriginal: indexOriginal
        });
        this.atualizarUI();
        this.verificarVitoria();
    }

    removerBlocoViga(id) {
        
        this.vigaAtual = this.vigaAtual.filter(b => b.id !== id);
        this.atualizarUI();
        this.renderizarBlocos();
        this.verificarVitoria();
    }

    atualizarUI() {
        const faseAtual = this.fases[this.faseAtual - 1];
        if (!faseAtual) return;

         // Atualizar placar
        const totalFases = this.fases.length;
        // Exibe "Fase 3 de 16"
        document.getElementById('placar-valor').textContent = `Fase ${this.faseAtual} de ${totalFases}`;
        // Atualiza a barra de progresso das fases totais
        const percentualFases = (this.faseAtual / totalFases) * 100;
        const barraFaseFill = document.getElementById('fase-progresso-fill');
        if (barraFaseFill) {
            barraFaseFill.style.width = `${percentualFases}%`;
        }
        // Calcular total da viga
        const totalViga = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
        // Atualizar a Linha Alvo Visual
        const linhaAlvo = document.getElementById('linha-alvo');
        if (linhaAlvo) {
            linhaAlvo.style.height = `${faseAtual.alvo * 100}%`;
            const balaoTexto = document.getElementById('balao-alvo-texto');
            if (balaoTexto) {
                balaoTexto.innerHTML = `Alvo: ${this.formatarFracaoHTML(faseAtual.descricao)}`;
        }
        // Brilhar verde se atingir o alvo exato
            if (Math.abs(totalViga - faseAtual.alvo) < 0.001) {
                linhaAlvo.classList.add('alvo-atingido');
            } else {
                linhaAlvo.classList.remove('alvo-atingido');
            }
        }
        
        const vigaContainer = document.getElementById('viga-container');
        if (vigaContainer) {
        // Viga racha (fica vermelha) se passar de 1 inteiro
            if (totalViga > 1.001) {
                vigaContainer.classList.add('sobrecarga');
            } else {
                vigaContainer.classList.remove('sobrecarga');
            }
        }

        // Atualizar viga construída
        this.renderizarVigaConstruida(totalViga);
        
        // Atualizar status
        this.atualizarStatus(totalViga, faseAtual.alvo);
                
    }

    renderizarVigaConstruida(total) {
    const vigaConstruida = document.getElementById('viga-construida');
    
    if (this.vigaAtual.length === 0) {
        vigaConstruida.innerHTML = '<div class="placeholder-text">Arraste os blocos aqui para construir!</div>';
        return;
    }

     // Gera o HTML de todos os blocos colocados
    const blocosHTML = this.vigaAtual.map(bloco => {
        // Multiplicamos por 100 para ter a porcentagem relativa ao "inteiro" (1.0)
        const alturaPercentual = bloco.fracao * 100;
        const labelFormatado = this.formatarFracaoHTML ? this.formatarFracaoHTML(bloco.label) : bloco.label;
        return `
            <div class="bloco-colocado ${bloco.classe}" 
                 style="height: ${alturaPercentual}%; width: 100%;" 
                 onclick="game.removerBlocoViga(${bloco.id})"
                 title="Clique para remover">
                ${labelFormatado}
            </div>
        `;
    }).join('');

        vigaConstruida.innerHTML = blocosHTML;

        // Adicionar exibição do total
        const totalDiv = document.createElement('div');
                
        vigaConstruida.appendChild(totalDiv);
    }    

    atualizarStatus(total, alvo) {
        const status = document.getElementById('status-mensagem');
        const diferenca = Math.abs(total - alvo);

        status.className = 'status-mensagem';

        if (diferenca < 0.001) {
            //status.textContent = '✅ Perfeito! Você montou a viga corretamente!';
            //status.classList.add('sucesso');
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
        const faseAtual = this.fases[this.faseAtual - 1];
        const totalViga = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
        const diferenca = Math.abs(totalViga - faseAtual.alvo);

        if (diferenca < 0.001) {
            this.vitoria();
        } else {
        // Se a viga não estiver no tamanho correto, esconde o botão
            const btnProxima = document.getElementById('btn-proxima');
            btnProxima.classList.remove('active');
        
        // Opcional: Remove a mensagem de sucesso se o usuário tirar o bloco
            const status = document.getElementById('status-mensagem');
            if (status.classList.contains('sucesso')) {
            status.className = 'status-mensagem';
            status.textContent = '';
            }
        }
    }

    vitoria() {
        console.log("rodando funcao vitoria()");
        
        const btnProxima = document.getElementById('btn-proxima');
        btnProxima.classList.add('active');
        
    }

    limpar() {
       
        this.vigaAtual = [];
        document.getElementById('btn-proxima').classList.remove('active');
        document.getElementById('status-mensagem').className = 'status-mensagem';
        document.getElementById('status-mensagem').textContent = '';
        this.renderizarBlocos();
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

    formatarFracaoHTML(texto) {
    if (!texto.includes('/')) return texto;
    const [num, den] = texto.split('/');
    return `
        <span class="fracao-estilizada">
            <span class="numerador">${num}</span>
            <span class="denominador">${den}</span>
        </span>
    `;
    }
}

// Inicializar o jogo
const game = new JogoFracoes();
