class JogoFracoes {
    constructor() {
        // console.log("construtor rodou!");
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
            { numero: 3, alvo: 3 / 4, descricao: '3/4', estoque: ['1/4', '1/4', '1/4', '1/4', '1/4'] },
            { numero: 4, alvo: 1 / 2, descricao: '1/2', estoque: ['1/4', '1/4', '1/4', '1/4'] },
            { numero: 5, alvo: 3 / 4, descricao: '3/4', estoque: ['1/2', '1/2', '1/4', '1/4'] },
            { numero: 6, alvo: 1, descricao: '1', estoque: ['1/2', '1/4', '1/4', '1/4'] },

            //Nível 2: Introduzir 1/8
            { numero: 7, alvo: 1, descricao: '1', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8'] },
            { numero: 8, alvo: 1 / 4, descricao: '1/4', estoque: ['1/2', '1/8', '1/8', '1/8'] },
            { numero: 9, alvo: 3 / 8, descricao: '3/8', estoque: ['1/2', '1/8', '1/8', '1/8', '1/8'] },
            { numero: 10, alvo: 1 / 2, descricao: '1/2', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8'] },
            { numero: 11, alvo: 1 / 2, descricao: '1/2', estoque: ['1/4', '1/8', '1/8', '1/8'] },
            { numero: 12, alvo: 3 / 4, descricao: '3/4', estoque: ['1/2', '1/4', '1/4', '1/8'] },
            { numero: 13, alvo: 3 / 8, descricao: '3/8', estoque: ['1/4', '1/8', '1/4', '1/2'] },
            { numero: 14, alvo: 5 / 8, descricao: '5/8', estoque: ['1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8', '1/8'] },
            { numero: 15, alvo: 5 / 8, descricao: '5/8', estoque: ['1/8', '1/8', '1/4', '1/8', '1/8'] },
            { numero: 16, alvo: 5 / 8, descricao: '5/8', estoque: ['1/8', '1/4', '1/4', '1/4'] },
            { numero: 17, alvo: 3 / 4, descricao: '3/4', estoque: ['1/8', '1/8', '1/2', '1/2'] },
            { numero: 18, alvo: 7 / 8, descricao: '7/8', estoque: ['1/2', '1/4', '1/8', '1/8'] },

            // ... adicione as outras fases seguindo este padrão
            //Nível 3: Introduzir 1/3, 1/6, 1/9


        ];

        // Tipos de blocos disponíveis
        this.tiposBlocos = {
            '1/2': { fracao: 1 / 2, label: '1/2', classe: 'bloco-meia' },
            '1/3': { fracao: 1 / 3, label: '1/3', classe: 'bloco-um-terco' },
            '1/4': { fracao: 1 / 4, label: '1/4', classe: 'bloco-um-quarto' },
            '1/5': { fracao: 1 / 5, label: '1/5', classe: 'bloco-um-quinto' },
            '1/6': { fracao: 1 / 6, label: '1/6', classe: 'bloco-um-sexto' },
            '1/7': { fracao: 1 / 7, label: '1/7', classe: 'bloco-um-setimo' },
            '1/8': { fracao: 1 / 8, label: '1/8', classe: 'bloco-um-oitavo' },
            '1/9': { fracao: 1 / 9, label: '1/9', classe: 'bloco-um-nono' },
            '1/10': { fracao: 1 / 10, label: '1/10', classe: 'bloco-um-dez-avos' },

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
        if (this.tutorial && this.tutorial.ativo && this.tutorial.passoAtual === 12) {
            const btnValidarJogo = document.getElementById('btn-validar');

            if (btnValidarJogo) {
                btnValidarJogo.classList.remove('tutorial-destaque');
            }

            if (this.tutorial.mao) {
                this.tutorial.mao.style.display = 'none';
        }
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
         // Avança para o passo 13 somente depois do modal abrir
            if (this.tutorial && this.tutorial.ativo && this.tutorial.passoAtual === 12) {
                setTimeout(() => {
                    this.tutorial.proximoPasso();
                }, 200);
            }
        }
    }
    

    fecharModalValidacao() {
        const modal = document.getElementById('modal-validacao');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    dispararAnimacaoConquistaAutomatica(chaveFracao) {
        // 1. Destaca o botão "Conquistas" do cabeçalho/jogo
        const btnConquistas = document.getElementById('btn-conquistas') || document.querySelector('.btn-conquistas');
        if (btnConquistas) {
            btnConquistas.classList.add('tutorial-destaque');
            btnConquistas.style.position = 'relative';
            btnConquistas.style.zIndex = '10001';
        }

        // 2. Pequena pausa para o jogador ver o botão destacado e depois "apertar" automaticamente
        setTimeout(() => {
            if (btnConquistas) {
                btnConquistas.classList.remove('tutorial-destaque');
                btnConquistas.style.zIndex = '';
            }
            
            // Abre o modal usando sua função nativa
            this.abrirModalConquistas();

            // 3. Aguarda o modal abrir no DOM para interagir com o slot interno
            setTimeout(() => {
                const slotConquista = document.querySelector(`[data-fracao-chave="${chaveFracao}"]`);
                if (slotConquista) {
                    // Centraliza a rolagem na nova conquista caso a lista cresça
                    slotConquista.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Adiciona a classe de animação que faz pulsar/brilhar
                    slotConquista.classList.add('conquista-brilho-tutorial');
                }
            }, 400);

        }, 1200); // Tempo de destaque do botão Conquistas

        // 4. Fechamento automático após o jogador contemplar o desbloqueio
        setTimeout(() => {
            const slotConquista = document.querySelector(`[data-fracao-chave="${chaveFracao}"]`);
            if (slotConquista) {
                slotConquista.classList.remove('conquista-brilho-tutorial');
            }
            
            // Fecha o painel nativamente
            this.fecharModalConquistas();
        }, 4500); // 1.2s iniciais + ~3s de exibição interna
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

             // --- DETECÇÃO DE NOVA CONQUISTA ---
            // Tira uma "foto" das frações que já estavam desbloqueadas antes
            const fracoesAntes = new Set(this.fracoesDesbloqueadas);

            // Registra as frações obtidas na viga construída
            if (this.faseAtual === 1) {
                this.fracoesDesbloqueadas.add('1/2');
            } else {
                this.vigaAtual.forEach(bloco => {
                    this.fracoesDesbloqueadas.add(bloco.label);
                });
            }
            // Atualiza os elementos visuais do painel de conquistas em background
            this.renderizarDesbloqueios();

            // Identifica se alguma fração passou a constar no Set agora
            let novaConquistaDesbloqueada = false;
            let chaveConquista = '';

            this.fracoesDesbloqueadas.forEach(chave => {
                if (!fracoesAntes.has(chave)) {
                    novaConquistaDesbloqueada = true;
                    chaveConquista = chave;
                }
            });
            // ----------------------------------
            this.faseAtual++;
            this.vigaAtual = [];
            this.renderizarBlocos();
            this.atualizarUI();

            if (this.tutorial && this.tutorial.ativo && this.tutorial.passoAtual === 13) {
                const btnProximaValidacao = document.getElementById('btn-proxima-validacao');
                if (btnProximaValidacao) btnProximaValidacao.classList.remove('tutorial-destaque');
                
                // Força o tutorial a ir para o passo 14 diretamente
                this.tutorial.proximoPasso();
                return; 
            }

            // Dispara a cadeia de animações de forma assíncrona se for um desbloqueio inédito
            if (novaConquistaDesbloqueada) {
                this.dispararAnimacaoConquistaAutomatica(chaveConquista);
            }

            if (this.faseAtual === 5) {
                // Pequeno atraso para garantir que o DOM já foi atualizado
                setTimeout(() => this.tutorial.iniciar(), 100);
            }
        } else {
            alert('🎉 Parabéns! Você completou todas as fases!');
            this.faseAtual = 1;
            this.fasesCompletadas = 0;
            this.vigaAtual = [];
            this.renderizarBlocos();
            this.atualizarUI();
        }
        if (this.tutorial && this.tutorial.ativo && this.tutorial.passoAtual === 13) {
            const btnProximaValidacao = document.getElementById('btn-proxima-validacao');
            if (btnProximaValidacao) btnProximaValidacao.classList.remove('tutorial-destaque');
            
            this.tutorial.encerrar();
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

        vigaContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        vigaContainer.addEventListener('drop', (e) => {
            e.preventDefault();

            // Extrair dados SEMPRE (antes de qualquer verificação)
            const index = parseInt(e.dataTransfer.getData('indexEstoque'));
            const chave = e.dataTransfer.getData('chaveBloco');
            const caracteristicas = this.tiposBlocos[chave];
            if (!caracteristicas) return;

            const totalVigaAtual = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);

            // ---------- TRATAMENTO DO TUTORIAL ----------
            if (this.tutorial && this.tutorial.ativo) {
                const tut = this.tutorial;

                // Tutorial Fase 1: passo 5 ou 6 (arrastar 1/2)
                if (tut.tutorialAtivo === 'fase1' && (tut.passoAtual === 5 || tut.passoAtual === 6 || tut.passoAtual === 8) && chave === '1/2') {
                    this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                    this.renderizarBlocos();
                    tut.proximoPasso();
                    return;
                }

                // Tutorial Fase 5: arrastar blocos
                if (tut.tutorialAtivo === 'fase5') {
                    // CASE 6: arrastar bloco azul (1/2)
                    if (tut.passoAtualFase5 === 6 && chave === '1/2') {
                        const totalVigaAtual = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
                        if (totalVigaAtual + caracteristicas.fracao <= 1.001) {
                            this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                            this.renderizarBlocos();
                            // Avança para o próximo passo (case 7)
                            setTimeout(() => tut.proximoPassoFase5(), 500);
                            return;
                        } else {
                            const status = document.getElementById('status-mensagem');
                            if (status) {
                                status.textContent = '⚠️ Isso ultrapassaria o tamanho da coluna!';
                                status.className = 'status-mensagem quase';
                            }
                            return;
                        }
                    }
                    
                    // CASE 7: arrastar bloco roxo (1/4)
                    if (tut.passoAtualFase5 === 7 && chave === '1/4') {
                        const totalVigaAtual = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
                        if (totalVigaAtual + caracteristicas.fracao <= 1.001) {
                            this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                            this.renderizarBlocos();
                            // Avança para o próximo passo (case 8)
                            setTimeout(() => tut.proximoPassoFase5(), 500);
                            return;
                        } else {
                            const status = document.getElementById('status-mensagem');
                            if (status) {
                                status.textContent = '⚠️ Isso ultrapassaria o tamanho da coluna!';
                                status.className = 'status-mensagem quase';
                            }
                            return;
                        }
                    }
                    
                    // CASE 11: ordem inversa (primeiro 1/4, depois 1/2)
                    if (tut.passoAtualFase5 === 11) {
                        const vigaVazia = this.vigaAtual.length === 0;
                        const primeiroE1Quarto = vigaVazia && chave === '1/4';
                        const segundoE1Meio = !vigaVazia && this.vigaAtual.length === 1 &&
                            this.vigaAtual[0].label.trim() === '1/4' && chave === '1/2';
                        
                        if (primeiroE1Quarto || segundoE1Meio) {
                            const totalVigaAtual = this.vigaAtual.reduce((sum, b) => sum + b.fracao, 0);
                            if (totalVigaAtual + caracteristicas.fracao <= 1.001) {
                                this.adicionarBlocoAViga(caracteristicas.fracao, caracteristicas.label, caracteristicas.classe, index);
                                this.renderizarBlocos();

                                // Se a sequência estiver completa (1/4 + 1/2), avançar para próximo passo
                                if (segundoE1Meio && this.vigaAtual.length === 2) {
                                    setTimeout(() => tut.proximoPassoFase5(), 500);
                                }
                                return;
                            }
                        } else {
                            const status = document.getElementById('status-mensagem');
                            if (status) {
                                if (vigaVazia) {
                                    status.textContent = '🔍 Comece arrastando o bloco roxo de 1/4!';
                                } else {
                                    status.textContent = '🔍 Agora arraste o bloco azul de 1/2 por cima!';
                                }
                                status.className = 'status-mensagem quase';
                            }
            return;
        }
    }
}

// Qualquer outro passo do tutorial bloqueia todos os drops
if (this.tutorial && this.tutorial.ativo) {
    return;
}

                // Qualquer outro passo do tutorial bloqueia todos os drops
                return;
            }

            // ---------- COMPORTAMENTO NORMAL (FORA DO TUTORIAL) ----------
            if (totalVigaAtual + caracteristicas.fracao > 1.001) {
                vigaContainer.classList.add('sobrecarga', 'tremer-viga');
                const status = document.getElementById('status-mensagem');
                if (status) {
                    status.textContent = '⚠️ Você colocou demais! O bloco não cabe na coluna de 1 inteiro.';
                    status.className = 'status-mensagem quase';
                }
                setTimeout(() => {
                    vigaContainer.classList.remove('tremer-viga');
                    if (totalVigaAtual <= 1.001) {
                        vigaContainer.classList.remove('sobrecarga');
                    }
                }, 500);
                return;
            }

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
        if (this.tutorial && this.tutorial.ativo) {
            // Permitir remoção apenas no passo 8 da fase 5 (experimento)
            if (!(this.tutorial.tutorialAtivo === 'fase5' && this.tutorial.passoAtualFase5 === 8)) {
                //console.log("Não é permitido remover blocos durante o tutorial!");
                return; // Sai da função imediatamente e não remove nada
            }
        }
        this.vigaAtual = this.vigaAtual.filter(b => b.id !== id);
        this.atualizarUI();
        this.renderizarBlocos();
        this.verificarVitoria();

        // Se todos os blocos foram removidos no passo 8 da fase 5, avançar para o passo 9
        if (this.tutorial && this.tutorial.ativo && this.tutorial.tutorialAtivo === 'fase5' &&
            this.tutorial.passoAtualFase5 === 8 && this.vigaAtual.length === 0) {
            setTimeout(() => this.tutorial.proximoPassoFase5(), 300);
        }
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
        // Adicionar todos os alvos e opções de frações possíveis do jogo aquiiiii
        const fracoes = [
            //Nível 1
            { decimal: 1, display: '1' },
            { decimal: 1 / 2, display: '1/2' },
            { decimal: 1 / 4, display: '1/4' },
            { decimal: 3 / 4, display: '3/4' },

            //Nível 2
            { decimal: 1 / 8, display: '1/8' },
            { decimal: 3 / 8, display: '3/8' },
            { decimal: 5 / 8, display: '5/8' },
            { decimal: 7 / 8, display: '7/8' },

            //Nível 3
            { decimal: 1 / 3, display: '1/3' },
            { decimal: 1 / 6, display: '1/6' },
            { decimal: 1 / 9, display: '1/9' },

            //Nível 4
            { decimal: 1 / 5, display: '1/5' },
            { decimal: 2 / 5, display: '2/5' },
            { decimal: 3 / 5, display: '3/5' },
            { decimal: 4 / 5, display: '4/5' },
            { decimal: 1 / 7, display: '1/7' },
            { decimal: 2 / 7, display: '2/7' },
            { decimal: 3 / 7, display: '3/7' },
            { decimal: 4 / 7, display: '4/7' },
            { decimal: 5 / 7, display: '5/7' },
            { decimal: 6 / 7, display: '6/7' },            
            { decimal: 1 / 10, display: '1/10' },            
            { decimal: 3 / 10, display: '3/10' },
            { decimal: 7 / 10, display: '7/10' },
            { decimal: 9 / 10, display: '9/10' },            
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
    // -------------------FUNÇÃO ÚNICA E UNIVERSAL DE TESTE DE TUTORIAIS------------------------------
    testarTutorial(fase) {
        // 1. Define os indicadores da fase baseado no parâmetro recebido
        this.faseAtual = fase;
        this.fasesCompletadas = fase - 1;
        
        // 2. Limpa a viga atual para começar o cenário do zero
        this.vigaAtual = [];
        
        // 3. Fecha modais pendentes para não sobrepor telas
        this.fecharModalConquistas();
        if (typeof this.fecharModalValidacao === 'function') {
            this.fecharModalValidacao();
        }

        // 4. Recarrega o estoque de blocos e atualiza a interface para a fase escolhida
        this.renderizarBlocos();
        this.atualizarUI();

        // 5. Reinicia e dispara o gerenciador de tutorial com a fase correta
        if (this.tutorial) {
            this.tutorial.encerrar(); // Para o tutorial anterior se houver algum rodando
            this.tutorial.iniciar(fase); // Inicia o novo tutorial desejado
            console.log(`Modo teste: Iniciando tutorial da fase ${fase}`);
        } else {
            console.error("Gerenciador de tutorial não foi encontrado na instância do jogo.");
        }
    }
}


class TutorialGerenciador {
    constructor(jogo) {
        this.jogo = jogo;
        this.passoAtual = 0;
        this.ativo = false;
        this.tutorialAtivo = null;   // 'fase1' ou 'fase5'
        this.passoAtualFase5 = 0;

        this.overlay = document.getElementById('tutorial-overlay');
        this.balao = document.getElementById('tutorial-balao');
        this.texto = document.getElementById('tutorial-texto');
        this.btn = document.getElementById('tutorial-btn');
        this.mao = document.getElementById('tutorial-mao');
        this.algebraBox = document.getElementById('tutorial-algebra');
    }

    iniciar() {
        if (this.btn) this.btn.style.display = 'block';
        const engenheiro = document.querySelector('.engenheiro');
        if (engenheiro && engenheiro.parentElement) {
            engenheiro.parentElement.classList.add('mestre-tutorial-ativa');
        }
        const btnPular = document.getElementById('tutorial-pular-btn');
        if (btnPular) btnPular.style.display = 'block';

        if (this.jogo.faseAtual === 1) {
            this.tutorialAtivo = 'fase1';
            this.passoAtual = 0;
            this.ativo = true;
            if (this.overlay) this.overlay.style.display = 'block';
            this.proximoPassoFase1();
        } else if (this.jogo.faseAtual === 5) {
            this.tutorialAtivo = 'fase5';
            this.passoAtualFase5 = 0;
            this.ativo = true;
            if (this.overlay) this.overlay.style.display = 'block';
            this.proximoPassoFase5();
        }
        // outras fases podem ser adicionadas no futuro
    }

    // Chamado pelo botão "Avançar" / "Pular"
    proximoPasso() {
        if (this.tutorialAtivo === 'fase1') {
            this.proximoPassoFase1();
        } else if (this.tutorialAtivo === 'fase5') {
            this.proximoPassoFase5();
        }
    }


    proximoPassoFase1() {
        this.passoAtual++;
        this.limparDestaques();               

        if (this.passoAtual === 1) {
            this.mostrarBalao("Olá! Eu sou a Mestre de Obras. Que bom que você chegou, nosso(a) Engenheiro(a) Chefe!", "center");
        }
        else if (this.passoAtual === 2) {
            const viga = document.getElementById('viga-container');
            const balaoAlvo = document.getElementById('balao-alvo-texto');
            
            if (viga) {
                viga.classList.add('tutorial-destaque');
                this.mostrarBalao("Nossa missão é construir colunas. Olhe ali: o tamanho <b>alvo</b> que precisamos alcançar agora é <b>1 coluna inteira</b>!", 
                                "right",
                                balaoAlvo);
            } 
            if (balaoAlvo) {                
                balaoAlvo.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.8)';
                balaoAlvo.style.outline = '3px solid #ffd700'; 
            }
            else {
                this.proximoPasso();
            }
        }
        else if (this.passoAtual === 3) {
            this.mostrarBalao("Mas nem sempre temos blocos inteiros. Às vezes, usamos pedaços menores, como metades (" + 
                                this.jogo.formatarFracaoHTML('1/2') + ") ou quartos (" + 
                                this.jogo.formatarFracaoHTML('1/4') + ")...", 
                            "center");
        }
        else if (this.passoAtual === 4) {
            const painelSoma = document.getElementById('viga-soma-algebrica');
            if (painelSoma) {
                painelSoma.classList.add('tutorial-destaque');
            }
            this.mostrarBalao("Aqui está a <b>Prancheta de Contas</b>! Ela mostra a soma dos blocos que você adiciona. Como a coluna ainda está vazia, ela começa no <b>0</b> (que é o elemento neutro da soma)!", "center");
        }        
        else if (this.passoAtual === 5) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pular";
            }

            const conteinerBlocos = document.getElementById('blocos-container');
            if (conteinerBlocos) conteinerBlocos.classList.add('tutorial-destaque');
            this.mostrarBalao("Além disso, este é o <b>Painel de Blocos Disponíveis</b>! Ele mostra o estoque de blocos que podemos usar em cada pedido. Veja que os blocos de metade (" + 
                this.jogo.formatarFracaoHTML('1/2') + ") são azuis e nós temos 4 deles!",
                "center"
            );
        }
        else if (this.passoAtual === 6) {
            document.getElementById('viga-container')?.classList.add('tutorial-destaque');

            const blocoMeio = document.querySelector('.bloco.bloco-meia:not(.usado)');

            if (blocoMeio) {
                blocoMeio.classList.add('bloco-piscar');
                blocoMeio.classList.add('tutorial-destaque');
                this.mostrarBalao("Para começar, clique e arraste este bloco de " +
                    this.jogo.formatarFracaoHTML('1/2') + " (uma metade) para dentro da coluna central.",
                    "right",
                    blocoMeio);

                setTimeout(() => {
                    this.iniciarAnimacaoMao(blocoMeio, document.getElementById('viga-container'));
                }, 100);
            } else {
                this.proximoPasso();
            }
        }
        else if (this.passoAtual === 7) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pular";
            }
            if (this.mao) this.mao.style.display = 'none';

            const painelSoma = document.getElementById('viga-soma-algebrica');
            if (painelSoma) {
                painelSoma.classList.add('tutorial-destaque');
            }
            const viga = document.getElementById('viga-container');
            if (viga) {
                viga.classList.add('tutorial-destaque');
            } 
            this.mostrarBalao("Olhe ali em cima! Toda vez que você coloca ou tira um bloco, a Prancheta de Contas atualiza sozinha.", "center");
        }
        else if (this.passoAtual === 8) {
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Pular";
            }
            if (this.mao) this.mao.style.display = 'none';
            const painelSoma = document.getElementById('viga-soma-algebrica');
            if (painelSoma) painelSoma.classList.remove('tutorial-destaque');
            const conteinerBlocos = document.getElementById('blocos-container');
            
            document.getElementById('viga-container')?.classList.add('tutorial-destaque');

            const proximoBlocoMeio = document.querySelector('.bloco.bloco-meia:not(.usado)');
            proximoBlocoMeio.classList.add('tutorial-destaque');


            if (proximoBlocoMeio) {
                proximoBlocoMeio.classList.add('bloco-piscar');
                proximoBlocoMeio.classList.add('tutorial-destaque');
                proximoBlocoMeio.setAttribute('draggable', 'true');
                this.mostrarBalao("Excelente! Agora arraste o <b>outro bloco azul de " + this.jogo.formatarFracaoHTML('1/2') + "</b> para completar 1 inteiro do alvo da coluna!", "right", proximoBlocoMeio);

                setTimeout(() => {
                    this.iniciarAnimacaoMao(proximoBlocoMeio, document.getElementById('viga-container'));
                }, 100);
            } else {
                this.proximoPasso();
            }
        }
        else if (this.passoAtual === 9) {
             if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar"; 
            }
            if (this.mao) this.mao.style.display = 'none';
            const painelSoma = document.getElementById('viga-soma-algebrica');
            if (painelSoma) {
                painelSoma.classList.add('tutorial-destaque');
            }
            const viga = document.getElementById('viga-container');
            if (viga) {
                viga.classList.add('tutorial-destaque');
                
            } 
            this.mostrarBalao("Perfeito! Veja o que aconteceu na Prancheta: os dois blocos se somaram!", "center");//

        }
        else if (this.passoAtual === 10) {
            if (this.mao) this.mao.style.display = 'none';
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar";
            }

            const viga = document.getElementById('viga-container');
            if (viga) {
                viga.classList.add('tutorial-destaque');
                
            }   
            if (this.algebraBox) {
                this.algebraBox.style.display = 'block';
                // this.algebraBox.innerHTML = `
                //     <span style="color:#764ba2; font-size:14px; display:block; margin-bottom:5px;">Matematicamente:</span>
                //     <div style="display:inline-block; vertical-align:middle; text-align:center;">
                //         <div>1</div><div style="border-top:2px solid #333">2</div>
                //     </div> + 
                //     <div style="display:inline-block; vertical-align:middle; text-align:center;">
                //         <div>1</div><div style="border-top:2px solid #333">2</div>
                //     </div> = 
                //     <div style="display:inline-block; vertical-align:middle; text-align:center;">
                //         <div>2</div><div style="border-top:2px solid #333">2</div>
                //     </div> = <strong style="color:#2bc48a">1</strong>
                // `;
            }

            this.mostrarBalao(
                "Você completou a coluna com sucesso!<br><br>" +
                "\u2714 Propriedade 1: " +
                "Quando somamos frações com o mesmo denominador, é simples: conservamos o denominador (o número de baixo) e somamos apenas os numeradores (os números de cima):<br>" +
                this.jogo.formatarFracaoHTML('1/2') + " + " + this.jogo.formatarFracaoHTML('1/2') + " = " + this.jogo.formatarFracaoHTML('1+1/2') + " = " + this.jogo.formatarFracaoHTML('2/2'),
                "top",
                document.getElementById('viga-container')
            );
        }
        else if (this.passoAtual === 11) {
             const viga = document.getElementById('viga-container');
            if (viga) {
                viga.classList.add('tutorial-destaque');
                
            } 
            if (this.mao) this.mao.style.display = 'none';
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar";
            }

            document.getElementById('viga-container')?.classList.add('tutorial-destaque');

                    this.mostrarBalao(
                        "\u2714 Propriedade 2: " +
                            "Além disso, quando aplicamos a mesma operação matemática em ambos (numerador e denominador), encontramos uma fração equivalente, que representa exatamente o mesmo tamanho de bloco:<br>" +
                            this.jogo.formatarFracaoHTML('2/2') +
                            " = " +
                            this.jogo.formatarFracaoHTML('2\u00F72/2\u00F72') +
                            " = " +
                            this.jogo.formatarFracaoHTML('1/1') +
                            " = 1.",
                        "top",
                        document.getElementById('viga-container')
                    );
         }
        
        else if (this.passoAtual === 12) {
            // Esconde o botão azul genérico do tutorial
            if (this.btn) this.btn.style.display = 'none'; 
            if (this.mao) this.mao.style.display = 'none';

            // Pega o botão VALIDAR real do jogo
            const btnValidarJogo = document.getElementById('btn-validar');
            if (btnValidarJogo) {
                // CORREÇÃO CRUCIAL 1: Ativa o botão removendo o bloqueio de clique
                btnValidarJogo.disabled = false;
                btnValidarJogo.style.pointerEvents = 'auto';
                btnValidarJogo.style.cursor = 'pointer';

                // CORREÇÃO CRUCIAL 2: Traz o botão para a frente do fundo escuro do tutorial
                btnValidarJogo.style.position = 'relative';
                btnValidarJogo.style.zIndex = '10001';
                btnValidarJogo.classList.add('tutorial-destaque');
                
                document.getElementById('viga-container')?.classList.add('tutorial-destaque');
                this.mostrarBalao(
                    "Excelente! A coluna está completa. Agora clique no botão <b>Validar</b> para testar a sua estrutura!", 
                    "right", 
                    btnValidarJogo
                );

                setTimeout(() => {
                    this.iniciarAnimacaoMao(btnValidarJogo, btnValidarJogo);
                }, 100);
            } else {
                this.proximoPasso();
            }
        }
        else if (this.passoAtual === 13) {
            if (this.btn) this.btn.style.display = 'none';
            if (this.mao) this.mao.style.display = 'none';

            // Restaura o z-index do botão validar antigo
            const btnValidarJogo = document.getElementById('btn-validar');
            if (btnValidarJogo) {
                btnValidarJogo.style.zIndex = '';
                btnValidarJogo.classList.remove('tutorial-destaque');
            }

            // Pega o botão de avançar de dentro do modal
            const btnProximaValidacao = document.getElementById('btn-proxima-validacao');
            if (btnProximaValidacao) {
                // Força o botão do modal a ficar clicável e visível acima do tutorial
                btnProximaValidacao.disabled = false;
                btnProximaValidacao.style.pointerEvents = 'auto';
                btnProximaValidacao.style.cursor = 'pointer';
                btnProximaValidacao.style.position = 'relative';
                btnProximaValidacao.style.zIndex = '10001';
                btnProximaValidacao.classList.add('tutorial-destaque');

                this.mostrarBalao(
                    "Muito bem, Engenheiro(a)! Sua estrutura foi aprovada! Clique em <b>Próxima Fase</b> para continuar.", 
                    "right", btnValidarJogo
                );

                setTimeout(() => {
                    this.iniciarAnimacaoMao(btnProximaValidacao, btnProximaValidacao);
                }, 100);
            } else {
                this.encerrar();
            }
        }
        else if (this.passoAtual === 14) {
            if (this.mao) this.mao.style.display = 'none';
            if (this.algebraBox) this.algebraBox.style.display = 'none';
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.textContent = "Avançar";
                this.btn.style.zIndex = '10001';
            }

            this.jogo.fracoesDesbloqueadas.add('1/2');
            this.jogo.renderizarDesbloqueios();

            const btnConquistas = document.getElementById('btn-conquistas');
            if (btnConquistas) {
                btnConquistas.style.position = 'relative';
                btnConquistas.style.zIndex = '10001';
                btnConquistas.classList.add('tutorial-destaque');
            }

            this.mostrarBalao(
                "Incrível! Você completou o pedido e desbloqueou um item! 🔓 Veja o botão de <b>Conquistas</b> iluminado no painel direito.",
                "left",
                btnConquistas
            );
        }
        else if (this.passoAtual === 15) {
            // Restaura o estilo do botão de conquistas do cabeçalho
            const btnConquistas = document.getElementById('btn-conquistas');
            if (btnConquistas) {
                btnConquistas.style.zIndex = '';
                btnConquistas.style.position = '';
                btnConquistas.classList.remove('tutorial-destaque');
            }

            // Abre o modal automaticamente para o tutorial
            this.jogo.abrirModalConquistas();            

            const slotMetade = document.querySelector('[data-fracao-chave="1/2"]');
            if (slotMetade) {
                slotMetade.classList.add('conquista-brilho-tutorial');
            }
            // Traz o botão de Avançar do Tutorial para a FRENTE do modal de conquistas!
            if (this.btn) {
                this.btn.style.display = 'block';
                this.btn.style.position = 'relative';
                this.btn.style.zIndex = '10010'; // 10010 é maior que o modal (10005)
                this.btn.textContent = "Pronto para o desafio! Começar Jogo 🚀";
            }

            // Traz o balão de texto para a frente também
            if (this.balao) {
                this.balao.style.zIndex = '10010';
            }

            this.mostrarBalao(
                "Sempre que você formar 1 inteiro usando <b>blocos iguais</b>, um novo item será desbloqueado 🏆. Você pode verificar seus itens a qualquer momento do jogo. Ele também serve de guia visual para as próximas fases!",
                "down"
            );
        }
        else {
            if (this.btn) {
                this.btn.style.zIndex = '';
                this.btn.style.position = '';
            }
            if (this.balao) {
                this.balao.style.zIndex = '';
            }
            this.encerrar();
        }
    }

    // ========== NOVO TUTORIAL DA FASE 5 ==========
    proximoPassoFase5() {
        this.passoAtualFase5++;
        this.limparDestaques();
        if (this.mao) this.mao.style.display = 'none';
        if (this.algebraBox) this.algebraBox.style.display = 'none';

        // O botão do tutorial sempre visível para prosseguir
        if (this.btn) {
            this.btn.style.display = 'block';
            this.btn.textContent = 'Avançar';
        }
        const vigaRef = document.getElementById('viga-container');

        // Reposicionar o balão para o canto superior direito
        // setTimeout(() => {
        //     this.reposicionarBalao();
        // }, 50);

        switch (this.passoAtualFase5) {
            case 1:
                document.getElementById('viga-container')?.classList.add('tutorial-destaque');
                this.mostrarBalao(
                    "Muito bem, Engenheiro(a)! Agora precisamos construir uma coluna de tamanho " +
                    this.jogo.formatarFracaoHTML('3/4')+".",
                    "right", document.getElementById('viga-container'), 
                );
                break;
            case 2:
                const conteinerBlocos = document.getElementById('blocos-container');
                if (conteinerBlocos) conteinerBlocos.classList.add('tutorial-destaque');
                this.mostrarBalao(
                    "Olhe o seu estoque: temos 2 blocos azuis de " +
                    this.jogo.formatarFracaoHTML('1/2') +
                    " e 2 blocos roxos de " +
                    this.jogo.formatarFracaoHTML('1/4') +
                    ". E agora? Eles têm tamanhos diferentes! Como vamos somar isso?",
                    "center"
                );
                break;

            case 3:
                // Destacar o botão Conquistas
                const btnConquistas = document.getElementById('btn-conquistas');
                if (btnConquistas) {
                    btnConquistas.classList.add('tutorial-destaque');
                }              
                
                this.mostrarBalao(
                    "Para somar frações, o ideal é que elas tenham o mesmo denominador (o número embaixo). " +
                    "Vamos usar um truque visual! Abra o seu <b>Painel de Conquistas</b>.",
                    "down"
                );
                if (this.btn) this.btn.textContent = "Pular";
                break;

            case 4:
                // Abre o modal automaticamente para o tutorial
                this.jogo.abrirModalConquistas();
                const slotMetade = document.querySelector('[data-fracao-chave="1/2"]');
                const slotQuarto = document.querySelector('[data-fracao-chave="1/4"]');
                if (slotMetade) {
                    slotMetade.classList.add('conquista-brilho-tutorial');
                }
                if (slotQuarto) {
                    slotQuarto.classList.add('conquista-brilho-tutorial');
                }
                // Traz o botão de Avançar do Tutorial para a FRENTE do modal de conquistas!
                if (this.btn) {
                    this.btn.style.display = 'block';
                    this.btn.style.position = 'relative';
                    this.btn.style.zIndex = '10010'; // 10010 é maior que o modal (10005)
                    this.btn.textContent = "Avançar";
                }

                // Traz o balão de texto para a frente também
                if (this.balao) {
                    this.balao.style.zIndex = '10010';
                }
                this.mostrarBalao(
                    "Lembra desses itens que você desbloqueou? Veja que 1 bloco azul de " +
                    this.jogo.formatarFracaoHTML('1/2') +
                    " é do mesmo tamanho que 2 blocos roxos de " +
                    this.jogo.formatarFracaoHTML('1/4')+".",
                    "center"
                );
                break;
            case 5:
                // Abre o modal automaticamente para o tutorial
                this.jogo.abrirModalConquistas();
                const slotMetade1 = document.querySelector('[data-fracao-chave="1/2"]');
                const slotQuarto1 = document.querySelector('[data-fracao-chave="1/4"]');
                if (slotMetade1) {
                    slotMetade1.classList.add('conquista-brilho-tutorial');
                }
                if (slotQuarto1) {
                    slotQuarto1.classList.add('conquista-brilho-tutorial');
                }
                // Traz o botão de Avançar do Tutorial para a FRENTE do modal de conquistas!
                if (this.btn) {
                    this.btn.style.display = 'block';
                    this.btn.style.position = 'relative';
                    this.btn.style.zIndex = '10010'; // 10010 é maior que o modal (10005)
                    this.btn.textContent = "Avançar";
                }

                // Traz o balão de texto para a frente também
                if (this.balao) {
                    this.balao.style.zIndex = '10010';
                }
                this.mostrarBalao(
                    "Ou seja: " +
                    this.jogo.formatarFracaoHTML('1/2') + " = " +
                    this.jogo.formatarFracaoHTML('1/4') + " + " +
                    this.jogo.formatarFracaoHTML('1/4') + " = " +
                    this.jogo.formatarFracaoHTML('1+1/4') + " = " +
                    this.jogo.formatarFracaoHTML('2/4') +
                    ". Pela propriedade de frações equivalentes, elas têm o mesmo valor!" +
                    this.jogo.formatarFracaoHTML('1/2') +
                    " = " +
                    this.jogo.formatarFracaoHTML('1x2/2x2') +
                    " = " +
                    this.jogo.formatarFracaoHTML('2/4'),
                    "center"
                );
                break;

            case 6: {
                this.jogo.fecharModalConquistas();

                const blocoAzul = document.querySelector('.bloco.bloco-meia:not(.usado)');

                if (blocoAzul) {
                    // Garante que o bloco está disponível
                    blocoAzul.classList.remove('usado');
                    blocoAzul.draggable = true;
                    blocoAzul.setAttribute('draggable', 'true');
                    blocoAzul.style.pointerEvents = 'auto';
                    
                    // DESTAQUE visual
                    blocoAzul.classList.add('bloco-piscar', 'tutorial-destaque');
                    
                    // DESTACA a viga também
                    const vigaRef = document.getElementById('viga-container');
                    if (vigaRef) {
                        vigaRef.classList.add('tutorial-destaque');
                    }

                    // Libera o overlay para permitir o drag
                    if (this.overlay) {
                        this.overlay.style.pointerEvents = 'none';
                    }

                    this.mostrarBalao(
                        "Sabendo disso, vamos testar! Arraste primeiro um bloco azul de " +
                        this.jogo.formatarFracaoHTML('1/2') +
                        " (que corresponde a " +
                        this.jogo.formatarFracaoHTML('1/4') + "+" +
                        this.jogo.formatarFracaoHTML('1/4') +
                        ") para a coluna.",
                        "right",
                        blocoAzul
                    );

                    setTimeout(() => {
                        this.iniciarAnimacaoMao(blocoAzul, vigaRef);
                    }, 100);

                } else {
                    this.proximoPassoFase5();
                }
                break;
            }

            case 7: {
                const blocoRoxo = document.querySelector('.bloco.bloco-um-quarto:not(.usado)');
                if (blocoRoxo) {
                    blocoRoxo.classList.remove('usado');
                    blocoRoxo.draggable = true;
                    blocoRoxo.setAttribute('draggable', 'true');
                    blocoRoxo.style.pointerEvents = 'auto';
                    
                    document.getElementById('viga-container')?.classList.add('tutorial-destaque');
                    blocoRoxo.classList.add('bloco-piscar', 'tutorial-destaque');
                    
                    this.mostrarBalao(
                        "Agora, para terminar de chegar ao alvo de " +
                        this.jogo.formatarFracaoHTML('3/4') +
                        ", arraste um bloco roxo de " +
                        this.jogo.formatarFracaoHTML('1/4') +
                        " para cima do azul.",
                        "right",
                        blocoRoxo
                    );
                    
                    setTimeout(() => {
                        this.iniciarAnimacaoMao(blocoRoxo, document.getElementById('viga-container'));
                    }, 100);
                    
                } else {
                    this.proximoPassoFase5();
                }
                if (this.btn) this.btn.textContent = "Pular";
                break;
            }

            case 8:
                if (this.overlay) {
                    this.overlay.style.pointerEvents = 'auto';
                }
                // Exibir explicação algébrica
                if (this.algebraBox) {
                    this.algebraBox.style.display = 'block';
                    this.algebraBox.innerHTML = `
                        <span style="color:#764ba2; font-size:14px;">Prancheta de Contas:</span><br>
                        <span style="font-size:20px;">
                            ${this.jogo.formatarFracaoHTML('2/4')} + ${this.jogo.formatarFracaoHTML('1/4')} = ${this.jogo.formatarFracaoHTML('3/4')}
                        </span>
                    `;
                }
                this.mostrarBalao(
                    "Olhe a mágica na Prancheta de Contas! Como o bloco de " +
                    this.jogo.formatarFracaoHTML('1/2') +
                    " vale a mesma coisa que " +
                    this.jogo.formatarFracaoHTML('1/4') + "+" + this.jogo.formatarFracaoHTML('1/4') +
                    ", a conta virou: " +
                    this.jogo.formatarFracaoHTML('2/4') + " + " + this.jogo.formatarFracaoHTML('1/4') + " = " + this.jogo.formatarFracaoHTML('3/4') +
                    ". Conseguimos o tamanho exato do alvo! É assim que realizamos a soma de frações com denominadores diferentes, precisamos “transformá-la” para todas terem o mesmo denominador.",
                    "top",
                    document.getElementById('viga-container')
                );
                if (this.btn) this.btn.textContent = "Entendi!";
                break;

            case 9:
                // Introdução à propriedade comutativa
                this.mostrarBalao(
                    "Mas espere... e se a gente tivesse construído essa coluna de um jeito diferente? Vamos fazer um experimento de engenharia!",
                    "center"
                );
                break;

            case 10:
                // Pedir para remover os blocos
                const viga = document.getElementById('viga-container');
                if (viga) viga.classList.add('tutorial-destaque');

                this.mostrarBalao(
                    "Agora, vamos retirar os blocos da coluna e refazer a construção, mas desta vez em ordem inversa!",
                    "top",
                    viga
                );
                if (this.btn) this.btn.textContent = "Pular";

                // Se a viga já está vazia, avançar automaticamente
                if (this.jogo.vigaAtual.length === 0) {
                    setTimeout(() => this.proximoPassoFase5(), 500);
                }
                break;

            case 11: {
                // Limpa a viga atual para começar de novo
                this.jogo.vigaAtual = [];
                this.jogo.renderizarBlocos();
                this.jogo.atualizarUI();

                const blocosQuarto = document.querySelectorAll('.bloco.bloco-um-quarto:not(.usado)');
                const blocosMeia = document.querySelectorAll('.bloco.bloco-meia:not(.usado)');
                const blocoRoxo2 = blocosQuarto.length > 0 ? blocosQuarto[0] : null;
                const blocoAzul2 = blocosMeia.length > 0 ? blocosMeia[0] : null;


                if (blocoRoxo2) {
                    blocoRoxo2.classList.remove('usado');
                    blocoRoxo2.draggable = true;
                    blocoRoxo2.classList.add('bloco-piscar', 'tutorial-destaque');
                }
                if (blocoAzul2) {
                    blocoAzul2.classList.remove('usado');
                    blocoAzul2.draggable = true;
                    blocoAzul2.classList.add('tutorial-destaque');
                }                               
                
                document.getElementById('viga-container')?.classList.add('tutorial-destaque');
                this.mostrarBalao(
                    "Agora arraste primeiro o bloco roxo de " +
                    this.jogo.formatarFracaoHTML('1/4') +
                    " (embaixo), e depois o azul de " +
                    this.jogo.formatarFracaoHTML('1/2') +
                    " (por cima).",
                    "top",
                    document.getElementById('viga-container')
                );
                if (this.btn) this.btn.textContent = "Pular";
                break;
            }

            case 12:
                // Mostrar a igualdade comutativa
                if (this.algebraBox) {
                    this.algebraBox.style.display = 'block';
                    this.algebraBox.innerHTML = `
                        <span style="color:#764ba2; font-size:14px;">Propriedade Comutativa:</span><br>
                        <span style="font-size:20px;">
                            ${this.jogo.formatarFracaoHTML('1/4')} + ${this.jogo.formatarFracaoHTML('2/4')} = ${this.jogo.formatarFracaoHTML('3/4')}
                        </span>
                    `;
                }
                this.mostrarBalao(
                    "Olhe só! A coluna ficou exatamente do mesmo tamanho de antes, não foi? Na matemática, isso se chama <b>Propriedade Comutativa</b>. " +
                    "Um nome chique para uma regra simples: a ordem dos blocos não muda o tamanho final da construção!<br>" +
                    this.jogo.formatarFracaoHTML('1/4') + " + " + this.jogo.formatarFracaoHTML('2/4') +
                    " é a mesma coisa que " +
                    this.jogo.formatarFracaoHTML('2/4') + " + " + this.jogo.formatarFracaoHTML('1/4'),
                    "top",
                    document.getElementById('viga-container')
                );
                if (this.btn) this.btn.textContent = "Entendi!";
                break;

            case 13:
                // Destacar botão Validar e encerrar
                const btnValidar = document.getElementById('btn-validar');
                if (btnValidar) {
                    btnValidar.classList.add('tutorial-destaque');
                }
                this.mostrarBalao(
                    "Clique em <b>Validar</b> para entregar mais essa obra perfeita!",
                    "top",
                    btnValidar
                );
                if (this.btn) {
                    this.btn.textContent = "Finalizar tutorial";
                    this.btn.onclick = () => this.encerrar();  // ao clicar, encerra de vez
                }
                break;

            default:
                this.encerrar();
                break;
        }
    }

    // ========== MÉTODOS AUXILIARES (mantidos exatamente como estavam) ==========

    mostrarBalao(mensagem, posicao, elementoAlvo = null) {
        if (!this.balao || !this.texto) return;

        this.balao.style.display = 'flex';
        this.texto.innerHTML = mensagem;
        
        // REGRA 1: Prioridade absoluta para centralização na tela.
        // Se for "center", ele posiciona no meio e o 'return' impede de executar o código abaixo.
        if (posicao === "center" || !elementoAlvo) {
            this.balao.style.top = "50%";
            this.balao.style.left = "50%";
            this.balao.style.transform = "translate(-50%, -50%)";
            return; 
        }

        // REGRA 2: Regras para posicionamento no canto (mantendo exatamente as suas variáveis e lógica originais)
        const isFase1Passo2 = this.tutorialAtivo === 'fase1';
        const isFase5 = this.tutorialAtivo === 'fase5';

        if (isFase1Passo2 || isFase5) {
            const container = document.querySelector('.container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Posiciona no canto superior direito do container (seus valores exatos)
                const top = rect.top + scrollTop + 20;
                const left = rect.right + scrollLeft - 620; // 600px (max-width) + 20px de margem

                this.balao.style.top = `${top}px`;
                this.balao.style.left = `${left}px`;
                this.balao.style.transform = "none";
            }
        } 
    }

    reposicionarBalao() {
        if (!this.balao) return;
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
        this.passoAtualFase5 = 0;
        this.tutorialAtivo = null;          // importante para a próxima chamada
        this.limparDestaques();
        if (this.overlay) this.overlay.style.display = 'none';
        if (this.balao) this.balao.style.display = 'none';
        if (this.mao) this.mao.style.display = 'none';
        if (this.algebraBox) this.algebraBox.style.display = 'none';

        const btnPular = document.getElementById('tutorial-pular-btn');
        if (btnPular) btnPular.style.display = 'none';

        const engenheiroContainer = document.querySelector('.right-panel');
        if (engenheiroContainer) {
            engenheiroContainer.classList.remove('mestre-tutorial-ativa');
        }

        const btnValidar = document.getElementById('btn-validar');
        if (btnValidar) {
            btnValidar.style.zIndex = '';
            btnValidar.style.position = '';
        }
        const btnProxima = document.getElementById('btn-proxima-validacao');
        if (btnProxima) {
            btnProxima.style.zIndex = '';
            btnProxima.style.position = '';
        }

        // Apenas da fase 1: desbloqueia 1/2 se ainda não tiver
        // (o jogo já cuida disso, mas podemos garantir)
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
// Inicialização Global
window.addEventListener('DOMContentLoaded', () => {
    const game = new JogoFracoes();
    window.game = game; // Garante o escopo global
    game.inicializar(); // Executa o tutorial com o HTML totalmente pronto
});