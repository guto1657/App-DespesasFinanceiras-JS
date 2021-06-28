class Despesa {
    constructor(ano,mes,dia,tipo,descricao,valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = parseFloat(valor).toFixed(2)
    }

    validarDespesa() {
        for(let i in this) {
            if(this[i] == undefined || this[i] == null || this[i] == '') {
                return false
            }
        }
        return true
    }


}

class Bd {

    constructor(){
        let id = localStorage.getItem('id')

        if(id == null) {
            localStorage.setItem('id',0)
        }
    }

    getProximoId() {
        let ProximoId = localStorage.getItem('id')

        return parseInt(ProximoId) + 1

    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id',id)

    }

    carregarRegistroDespesas(){
        let despesas = Array()

        let id = localStorage.getItem('id')

        for(let i = 1; i <= id; i++) {
            let despesa = JSON.parse(localStorage.getItem(i))

            if(despesa == null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)

        }

        return despesas

    }

    pesquisar(despesa) {
        let despesasFiltradas = Array()

        despesasFiltradas = this.carregarRegistroDespesas()

        if(despesa.ano != ''){
            despesasfiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano)
        }

        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes)
        }

        if(despesa.dia != ''){
            despesasfiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia)
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter((d) => d.tipo == despesa.tipo)
        }

        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter((d) => d.descricao == despesa.descricao)
        }

        if(despesa.valor !== ''){
            despesasFiltradas = despesasFiltradas.filter((d) => d.valor == despesa.valor)
        }

        return despesasFiltradas

    }

    remover(id) {
        localStorage.removeItem(id)
        window.location.reload()
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById("ano")
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value, descricao.value, valor.value)

    let modalHeader = document.getElementById('modalHeader')
    let modalTitulo = document.getElementById('modalTitulo')
    let modalMensagem = document.getElementById('modalMensagem')
    let modalBtn = document.getElementById('modalBtn')

    if(despesa.validarDespesa()){
        bd.gravar(despesa)

        modalHeader.classList = 'modal-header text-success'
        modalTitulo.innerHTML = 'Registro inserido com sucesso'
        modalMensagem.innerHTML = 'Despesa foi cadastrada com sucesso!'
        modalBtn.className = 'btn btn-success'
        modalBtn.innerHTML = 'Voltar'

        $('#modalRegistraDespesa').modal('show')

    } else{
        modalHeader.classList = 'modal-header text-danger'
        modalTitulo.innerHTML = 'Erro na inclusão do registro'
        modalMensagem.innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
        modalBtn.className = 'btn btn-danger'
        modalBtn.innerHTML = 'Voltar e corrigir'

        $('#modalRegistraDespesa').modal('show')
    }


}

function carregarListaDespesas(despesas = Array(), filtro = false) {
    if(despesas.length == 0 && filtro == false) {
        despesas = bd.carregarRegistroDespesas()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach((d) => {

        let linha = listaDespesas.insertRow()

        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch(d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break;
            case '2': d.tipo = 'Educação'
                break;
            case '3': d.tipo = 'Lazer'
                break;
            case '4': d.tipo = 'Saúde'
                break;
            case '5': d.tipo = 'Transporte'
                break;
        }

        linha.insertCell(1).innerHTML = `${d.tipo}`

        linha.insertCell(2).innerHTML = `${d.descricao}`

        d.valor = parseFloat(d.valor).toFixed(2)

        linha.insertCell(3).innerHTML = `R$${d.valor}`

        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.id = `id_despesa_${d.id}`
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function() {
            let id = btn.id
            id = id.replace('id_despesa_','')
            bd.remover(id)
        }
        
        linha.insertCell(4).append(btn)

    })

}

function pesquisarDespesas() {
    let ano = document.getElementById("ano")
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value,mes.value,dia.value,tipo.value, descricao.value, valor.value)
    
    let despesas = bd.pesquisar(despesa)

    this.carregarListaDespesas(despesas, true)
}
