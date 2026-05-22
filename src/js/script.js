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
            { numero: 5, alvo: 3/4, descricao: '3/4', estoque: ['1/2', '1/2', '1/4', '1/4'] },
            { numero: 6, alvo: 1, descricao: '1', estoque: ['1/2', '1/4', '1/4','1/4'] },

            //Nível 2: Introduzir 1/8
            { numero: 7, alvo: 1, descricao: '1', estoque: ['1/8', '1/8', '1/8', '1/8','1/8', '1/8', '1/8', '1/8','1/8', '1/8'] },
            { numero: 8, alvo: 1/4, descricao: '1/4', estoque: ['1/2', '1/8', '1/8','1/8'] },
            { numero: 9, alvo: 3/8, descricao: '3/8', estoque: ['1/2', '1/8', '1/8', '1/8','1/8'] },
            { numero: 10, alvo: 1/2, descricao: '1/2', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8'] },          
            { numero: 11, alvo: 1/2, descricao: '1/2', estoque: ['1/4', '1/8', '1/8', '1/8'] },            
            { numero: 12, alvo: 3/4, descricao: '3/4', estoque: ['1/2', '1/4', '1/4', '1/8'] },
            { numero: 13, alvo: 3/8, descricao: '3/8', estoque: ['1/4', '1/8', '1/4', '1/2'] },
            { numero: 14, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8','1/8'] },
            { numero: 15, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/8', '1/4', '1/8', '1/8'] },
            { numero: 16, alvo: 5/8, descricao: '5/8', estoque: ['1/8', '1/4', '1/4', '1/4'] },
            { numero: 17, alvo: 3/4, descricao: '3/4', estoque: ['1/8', '1/8', '1/2', '1/2'] },
            
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
        this.tutorial = new TutorialGerenciador(this);
        //this.inicializar();
    }

    abrirModalConquistas() {
        const modal = document.getElementById('modal-conquistas');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    fecharModalConquistas() {
        const modal = document.getElementById('modal-conquistas');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    abrirModalValidacao() {
        const vigaAtual = this.vigaAtual;
        
        if (vigaAtual.length === 0) {
            alert('⚠️ Coloque alguns blocos na viga antes de validar!');
            return;
        }

        const modal = document.getElementById('modal-validacao');
        const faseAtual = this.fases[this.faseAtual - 1];
        const totalViga = vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
        const isCorretto = Math.abs(totalViga - faseAtual.alvo) < 0.001;

        // Exibe a expressão algébrica
        const itensSomadosHTML = vigaAtual
            .map(b => this.formatarFracaoHTML(b.label))
            .join(' <span class="operador">+</span> ');
        
        const resultadoFormatado = this.formatarFracao(totalViga);
        const resultadoHTML = this.formatarFracaoHTML(resultadoFormatado);

        document.getElementById('validacao-expressao').innerHTML = 
            `${itensSomadosHTML} <span class="operador">=</span> ${resultadoHTML}`;

        // Exibe o resultado (check ou X)
        const resultadoDiv = document.getElementById('validacao-resultado');
        if (isCorretto) {
            resultadoDiv.innerHTML = `
                <div class="validacao-check">✅</div>
                <div class="validacao-mensagem">Resposta Correta!</div>
            `;
            
            // Mostra o botão "Próxima Fase" e esconde o "Limpar"
            document.getElementById('btn-proxima-validacao').style.display = 'block';
            document.getElementById('btn-limpar-validacao').classList.remove('show');
            document.getElementById('btn-limpar-validacao').style.display = 'none';
        } else {
            resultadoDiv.innerHTML = `
                <div class="validacao-check" style="font-size: 60px;">❌</div>
                <div class="validacao-mensagem validacao-error">Resposta Incorreta!</div>
                <div style="font-size: 14px; color: #666; margin-top: 10px;">Alvo: ${this.formatarFracaoHTML(faseAtual.descricao)}</div>
            `;

            // Mostra o botão "Limpar" e esconde o "Próxima Fase"
            document.getElementById('btn-proxima-validacao').style.display = 'none';
            document.getElementById('btn-limpar-validacao').classList.add('show');
            document.getElementById('btn-limpar-validacao').style.display = 'block';
        }

        if (modal) {
            modal.style.display = 'block';
        }
    }

    fecharModalValidacao() {
        const modal = document.getElementById('modal-validacao');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    inicializar() {    
        this.renderizarBlocos();
        this.configurarDragAndDrop();
        this.renderizarDesbloqueios();
        this.atualizarUI();

        setTimeout(() => this.tutorial.iniciar(), 100);
    }

    proximaFase() {
        if (this.faseAtual < this.fases.length) {
            this.fasesCompletadas++;
            
            // CORREÇÃO: Registra APENAS as frações que estão atualmente construídas na viga
            if (this.faseAtual === 1) {
                this.fracoesDesbloqueadas.add('1/2');
            } else {
                this.vigaAtual.forEach(bloco => {
                    this.fracoesDesbloqueadas.add(bloco.label);
                }); 
            }

            this.renderizarDesbloqueios();
            this.faseAtual++;
            this.vigaAtual = [];
            this.renderizarBlocos();
            this.atualizarUI();
        } else {
            alert('🎉 Parabéns! Você completou todas as fases!');
            this.faseAtual = 1;
            this.fasesCompletadas = 0;
            this.vigaAtual = [];
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

            if (this.tutorial && this.tutorial.ativo && this.tutorial.passoAtual === 5 && chave === '1/2') {
                bloco.style.position = 'relative';
                bloco.style.zIndex = '99999';
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
        if (!vigaContainer) return;
        
        //Garante que o dragover executa sempre o preventDefault()
        vigaContainer.addEventListener('dragover', (e) => {
            e.preventDefault(); 
        });

        vigaContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const index = parseInt(e.dataTransfer.getData('indexEstoque'));
            const chave = e.dataTransfer.getData('chaveBloco');
            const caracteristicas = this.tiposBlocos[chave];

            if (!caracteristicas) return;

            // 1. Calcula quanto a viga já tem atualmente
            const totalVigaAtual = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);

            //2. Verifica se somando o novo bloco ultrapassa 1 inteiro
            if (totalVigaAtual + caracteristicas.fracao > 1.001) {
                // 1. Aplica a classe de cor vermelha que você já usa na atualizarUI
                vigaContainer.classList.add('sobrecarga');
                // 2. Aplica a classe para tremer (vamos criar no CSS abaixo)
                vigaContainer.classList.add('tremer-viga');
                
                // 3. Atualiza o texto do status para avisar o jogador
                const status = document.getElementById('status-mensagem');
                if (status) {
                    status.textContent = '⚠️ Você colocou demais! O bloco não cabe na coluna de 1 inteiro.';
                    status.className = 'status-mensagem quase';
                }

                // 4. Remove os efeitos visuais após 500ms (tempo da animação)
                setTimeout(() => {
                    vigaContainer.classList.remove('tremer-viga');
                    // Só remove a cor vermelha se a viga original já não estivesse cheia antes
                    if (totalVigaAtual <= 1.001) {
                        vigaContainer.classList.remove('sobrecarga');
                    }
                }, 500);

                return; // Impede adicionar mais blocos se ultrapassar o alvo
            }

            // Se o tutorial estiver ativo
            if (this.tutorial && this.tutorial.ativo) {
                // Se for o passo 5 ou 6 e o bloco correto for o 1/2
                if ((this.tutorial.passoAtual === 5 || this.tutorial.passoAtual === 6) && chave === '1/2') {
                    const caracteristicas = this.tiposBlocos[chave];
                    this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                    this.renderizarBlocos();
                    this.tutorial.proximoPasso();
                    return;
                } else {
                    return; // Bloqueia outros blocos durante o tutorial
                }
            }

            // Comportamento normal do jogo (fora do tutorial)
            
            if (caracteristicas) {
                this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                this.renderizarBlocos();
            }
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
        if (this.tutorial && this.tutorial.ativo) {
            //console.log("Não é permitido remover blocos durante o tutorial!");
            return; // Sai da função imediatamente e não remove nada
        }
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
        
        const painelSoma = document.getElementById('viga-soma-algebrica');
        if (painelSoma) {
            if (this.vigaAtual.length === 0) {
                painelSoma.innerHTML = '<span class="soma-vazia">0</span>';
            } else {
                // Cria o texto de frações somadas: "1/4 + 1/4" formatado em HTML
                const itensSomadosHTML = this.vigaAtual
                    .map(b => this.formatarFracaoHTML(b.label))
                    .join(' <span class="operador">+</span> ');

                // Calcula o valor total bonito (ex: se for 0.5, mostra 1/2)
                const resultadoFormatado = this.formatarFracao(totalViga);
                const resultadoHTML = this.formatarFracaoHTML(resultadoFormatado);

                // Monta a estrutura final na tela
                // com soma
                // painelSoma.innerHTML = `
                //     <div class="expressao-algebrica">
                //         ${itensSomadosHTML} <span class="operador">=</span> <strong class="resultado-soma">${resultadoHTML}</strong>
                //     </div>
                // `;
                // sem soma
                painelSoma.innerHTML = `
                    <div class="expressao-algebrica">
                        ${itensSomadosHTML}
                    </div>
                `;
            }
        }

        // Atualizar a Linha Alvo Visual
        const linhaAlvo = document.getElementById('linha-alvo');
        if (linhaAlvo) {
            //linhaAlvo.style.height = `${faseAtual.alvo * 100}%`;
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
        }
    }

    vitoria() {
        // Não precisa mais fazer nada aqui
        // O botão "Próxima Fase" só aparecerá dentro do modal de validação
    }

    limpar() {
        this.vigaAtual = [];
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


class TutorialGerenciador {
    constructor(jogo) {
        this.jogo = jogo;
        this.passoAtual = 0;
        this.ativo = false;
        
        this.overlay = document.getElementById('tutorial-overlay');
        this.balao = document.getElementById('tutorial-balao');
        this.texto = document.getElementById('tutorial-texto');
        this.btn = document.getElementById('tutorial-btn');
        this.mao = document.getElementById('tutorial-mao');
        this.algebraBox = document.getElementById('tutorial-algebra');
    }

    iniciar() {
        if (this.jogo.faseAtual !== 1) return;
        this.ativo = true;
        this.passoAtual = 0;
        if (this.overlay) this.overlay.style.display = 'block';
        this.proximoPasso();
    }

    proximoPasso() {
        this.passoAtual++;
        this.limparDestaques();

        if (this.btn) this.btn.style.display = 'block'; 

        if (this.passoAtual === 1) {
            this.mostrarBalao("Olá, matemático! Este é um jogo de frações.", "center");
        } 
        else if (this.passoAtual === 2) {
            const viga = document.getElementById('viga-container');
            if (viga) {
                viga.classList.add('tutorial-destaque');
                this.mostrarBalao("Esta é a <b>coluna central</b>. Seu objetivo é preenchê-la com blocos até atingir a <b>fração alvo</b> indicada.", "center");
            } else {
                this.proximoPasso();
            }
        }
        else if (this.passoAtual === 3) {
            const balaoAlvo = document.getElementById('balao-alvo-texto');
            if (balaoAlvo) {
                balaoAlvo.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
                balaoAlvo.style.outline = '3px solid #ffd700';
            }
            this.mostrarBalao(
                "Este é o indicador de <b>Alvo</b> 🎯! Ele mostra qual fração você precisa construir. " +
                "Por exemplo, se mostrar <b>1/2</b>, você precisa preencher exatamente metade da coluna. " +
                "Complete o alvo corretamente e você avançará para a próxima fase!",
                "center"
            );
        }
        else if (this.passoAtual === 4) {
            const painelSoma = document.getElementById('viga-soma-algebrica');
            if (painelSoma) {
                painelSoma.classList.add('tutorial-destaque');
            }
            this.mostrarBalao(
                "Aqui está a <b>Soma Algébrica</b> 📐! Ela mostra quais blocos você adicionou à coluna e sua soma. " +
                "Por exemplo: <b>1/2 + 1/2</b> significa que você colocou dois blocos de 1/2. " +
                "Use isso para acompanhar o progresso enquanto constrói!",
                "center"
            );
        }
        else if (this.passoAtual === 5) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pular";
            }
            
            const conteinerBlocos = document.getElementById('blocos-container');
            if (conteinerBlocos) conteinerBlocos.classList.add('tutorial-destaque');
            document.getElementById('viga-container')?.classList.add('tutorial-destaque');

            const blocoMeio = document.querySelector('.bloco.bloco-meia:not(.usado)');

            if (blocoMeio) {
                blocoMeio.classList.add('bloco-piscar');
                blocoMeio.classList.add('tutorial-destaque');
                this.mostrarBalao("Para começar, vá ao painel de blocos e arraste este bloco de " + 
                this.jogo.formatarFracaoHTML('1/2') + " (uma metade)    para dentro da coluna central.", 
                "right", 
                blocoMeio);
                
                setTimeout(() => {
                    this.iniciarAnimacaoMao(blocoMeio, document.getElementById('viga-container'));
                }, 100);
            } else {
                this.proximoPasso(); 
            }
        } 
        else if (this.passoAtual === 6) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pular";
            }
            if (this.mao) this.mao.style.display = 'none';

            const conteinerBlocos = document.getElementById('blocos-container');
            if (conteinerBlocos) conteinerBlocos.classList.add('tutorial-destaque');
            document.getElementById('viga-container')?.classList.add('tutorial-destaque');
            
            const proximoBlocoMeio = document.querySelector('.bloco.bloco-meia:not(.usado)');

            if (proximoBlocoMeio) {
                proximoBlocoMeio.classList.add('bloco-piscar');
                proximoBlocoMeio.classList.add('tutorial-destaque');
                this.mostrarBalao("Excelente! Agora arraste o <b>outro bloco de " + this.jogo.formatarFracaoHTML('1/2') + "</b> para completar 1 inteiro do alvo da coluna!", "right", proximoBlocoMeio);
                
                setTimeout(() => {
                    this.iniciarAnimacaoMao(proximoBlocoMeio, document.getElementById('viga-container'));
                }, 100);
            } else {
                this.proximoPasso();
            }
        }

        else if (this.passoAtual === 7) {
            if (this.mao) this.mao.style.display = 'none';
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar";
            }

            document.getElementById('viga-container')?.classList.add('tutorial-destaque');
            
            if (this.algebraBox) {
                this.algebraBox.style.display = 'block';
                this.algebraBox.innerHTML = `
                    <span style="color:#764ba2; font-size:14px; display:block; margin-bottom:5px;">Matematicamente:</span>
                    <div style="display:inline-block; vertical-align:middle; text-align:center;">
                        <div>1</div><div style="border-top:2px solid #333">2</div>
                    </div> + 
                    <div style="display:inline-block; vertical-align:middle; text-align:center;">
                        <div>1</div><div style="border-top:2px solid #333">2</div>
                    </div> = 
                    <div style="display:inline-block; vertical-align:middle; text-align:center;">
                        <div>2</div><div style="border-top:2px solid #333">2</div>
                    </div> = <strong style="color:#2bc48a">1</strong>
                `;
            }

            this.mostrarBalao(
                "Você completou a coluna com sucesso!<br>" +
                "Veja que, (" + 
                this.jogo.formatarFracaoHTML('1/2') + " + " + this.jogo.formatarFracaoHTML('1/2') + ") = " + this.jogo.formatarFracaoHTML('2/2') + " = 1, isto é, 2 blocos de " + this.jogo.formatarFracaoHTML('1/2') + " correspondem exatamente à fração alvo de 1 inteiro.", 
                "top", 
                document.getElementById('viga-container')
            );
        }
        else if (this.passoAtual === 8) {
            if (this.algebraBox) this.algebraBox.style.display = 'none';
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar";
            }
            
            this.jogo.fracoesDesbloqueadas.add('1/2');
            this.jogo.renderizarDesbloqueios();

            const btnConquistas = document.getElementById('btn-conquistas');
            if (btnConquistas) {
                btnConquistas.classList.add('tutorial-destaque');
            }
            
            this.mostrarBalao(
                "Excelente! Você desbloqueou um item! 🔓 Veja o botão de <b>Conquistas</b> no painel direito. Clique nele para ver seus itens desbloqueados!",
                "down"
            );
        }
        else if (this.passoAtual === 9) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pronto para o desafio! Começar Jogo 🚀";
            }

            // Abre o modal automaticamente para o tutorial
            this.jogo.abrirModalConquistas();
            const modal = document.getElementById('modal-conquistas');
            if (modal) {
                modal.classList.add('tutorial-destaque');
            }

            const slotMetade = document.querySelector('[data-fracao-chave="1/2"]');
            if (slotMetade) {
                slotMetade.classList.add('conquista-brilho-tutorial');
            }

            this.mostrarBalao(
                "Aqui está seu <b>Painel de Conquistas!</b> 🏆 Cada vez que você formar 1 inteiro usando <strong>blocos iguais</strong>, um novo item será desbloqueado. " +
                "Use este painel como um guia visual para entender quais frações você já domina!<br>" +
                "Nas próximas fases, quando você começar a misturar blocos diferentes, você desbloqueará mais itens.",
                "down"
            );
        }
        else {
            this.encerrar();
        }
    }

    mostrarBalao(mensagem, posicao, elementoAlvo = null) {
        if (!this.balao || !this.texto) return;
        
        this.balao.style.display = 'flex';
        this.texto.innerHTML = mensagem;

        // A partir do passo 2, coloca no canto superior direito do container
        if (this.passoAtual >= 2) {
            const container = document.querySelector('.container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Posiciona no canto superior direito do container
                const top = rect.top + scrollTop + 20;
                const left = rect.right + scrollLeft - 620; // 600px (max-width) + 20px de margem
                
                this.balao.style.top = `${top}px`;
                this.balao.style.left = `${left}px`;
                this.balao.style.transform = "none";
            }
        } else {
            // Passo 1: centralizado na tela
            if (posicao === "center" || !elementoAlvo) {
                this.balao.style.top = "50%";
                this.balao.style.left = "50%";
                this.balao.style.transform = "translate(-50%, -50%)";
            }
        }
    }

    iniciarAnimacaoMao(origem, destino) {
        if (!this.mao || !origem || !destino) return;

        const rectOrigem = origem.getBoundingClientRect();
        const rectDestino = destino.getBoundingClientRect();
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        this.mao.style.setProperty('--start-y', `${rectOrigem.top + scrollTop + (rectOrigem.height / 2)}px`);
        this.mao.style.setProperty('--start-left', `${rectOrigem.left + scrollLeft + (rectOrigem.width / 2)}px`);
        this.mao.style.setProperty('--end-y', `${rectDestino.top + scrollTop + (rectDestino.height / 2)}px`);
        this.mao.style.setProperty('--end-left', `${rectDestino.left + scrollLeft + (rectDestino.width / 2)}px`);

        this.mao.style.display = 'block';
        this.mao.className = 'tutorial-mao';
        void this.mao.offsetWidth; 
        this.mao.className = 'tutorial-mao mao-animando';
    }

    limparDestaques() {
        document.querySelectorAll('.tutorial-destaque').forEach(el => {
            el.classList.remove('tutorial-destaque');
            el.classList.remove('bloco-piscar');
        });
        document.querySelectorAll('.conquista-brilho-tutorial').forEach(el => {
            el.classList.remove('conquista-brilho-tutorial');
        });
        // Limpar estilos do balão alvo
        const balaoAlvo = document.getElementById('balao-alvo-texto');
        if (balaoAlvo) {
            balaoAlvo.style.boxShadow = '';
            balaoAlvo.style.outline = '';
        }
    }

    encerrar() {
        this.ativo = false;
        this.passoAtual = 0;
        this.limparDestaques();
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.balao) this.balao.style.display = 'none';
        if (this.mao) this.mao.style.display = 'none';
        if (this.algebraBox) this.algebraBox.style.display = 'none';
        
        this.jogo.fracoesDesbloqueadas.add('1/2');
        this.jogo.renderizarDesbloqueios(); 

        const slotMetade = document.querySelector('[data-fracao-chave="1/2"]');
        if (slotMetade) {
            slotMetade.classList.remove('conquista-brilho-tutorial');
        }

        // Fecha o modal de conquistas ao encerrar o tutorial
        this.jogo.fecharModalConquistas();

        document.getElementById('viga-container')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
// Inicialização Global Única Correta
// Remova a linha "const game = new JogoFracoes();" de onde ela está solta e use assim:
window.addEventListener('DOMContentLoaded', () => {
    const game = new JogoFracoes();
    window.game = game; // Garante o escopo global
    game.inicializar(); // Executa o tutorial com o HTML totalmente pronto
});