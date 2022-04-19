import React from "react";
import {Table, Button, Form, Modal} from "react-bootstrap";
import api from '../Api';

class Lista extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            id: null,
            cpf: '',
            nome: '',
            contribuicao: '',
            lista : [],
            modalAberta: true
        }
    }

    componentDidMount() {
        this.buscarColaborador();
    }

    componentWillUnmount() {

    }

    /**
     *  faz requisição para buscar e atualizar no estado
     */
    buscarColaborador = () => {
        api.get("/colaborador")

            .then(resposta => {
                this.setState({ lista : resposta.data })
            })
    }
        
    /**
     * metodo faz a requisição para deletar e remover do estado
     * @param {*} id 
     */
    deletarColaborador = (id) => {
        api.delete("/colaborador?id="+id)
            .then(resposta => {
                if(resposta.data){
                    var array = [...this.state.lista];
                    const i = array.findIndex(object => {
                        return object.id === id;
                      });
                    if (i !== -1) {
                        array.splice(i, 1);
                        this.setState({lista: array});
                    }
                }
            })
    }

    /**
     * metodo que faz a requisiçao para editar
     * @param {*} colaborador 
     * @returns 
     */
    editarColaborador = (colaborador) =>{
        if (! this.validate()){
            alert('Prencha todos os campos para continuar!')
            return
        }

        api.put("/colaborador?id="+colaborador.id, colaborador)
        .then(resposta => {
            if(resposta.data){
                this.showModal()
                this.reset()
                this.buscarColaborador()
                alert("Alterado Com Sucesso!")
            }
        })
    }

    /**
     * metodo que faz a requisição para cadastro
     * @param {*} colaborador 
     * @returns 
     */
    cadastraColaborador = (colaborador) => {
        if (! this.validate()){
            alert('Prencha todos os campos para continuar!')
            return
        }
        
        api.post("/colaborador", colaborador)
        .then(resposta => {
            if (resposta.data) {
                this.buscarColaborador();
            }else{
                alert('Ocorreu um error ao cadastrar!')
            }
        })
    }

    /**
     * recebe array e a propriedade para formatar as contribuições
     * @param {*} arr 
     * @param {*} prop 
     * @returns 
     */
    getProps = (arr, prop) => {
        let str = '';
      
        arr.forEach(a => {
          str += `${a[prop]}/`;
        })
      
        if (str.endsWith('/')) str = str.substring(0, str.length - 1);
      
        return str;
      }

    renderTable(){
        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>CPF</th>
                            <th>Nome</th>
                            <th>Contribuição</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.lista.map((colaborador)=> 
                                <tr key={colaborador.id}>
                                    <td> {colaborador.id} </td>
                                    <td> {colaborador.cpf} </td>
                                    <td> {colaborador.name} </td>
                                    <td> {this.getProps(colaborador.itens,"food")} </td>
                                    <td>
                                        <Button type='submit' variant="light" onClick={()=> {
                                            this.showModal()
                                            this.setState({
                                                id: colaborador.id,
                                                cpf: colaborador.cpf,
                                                nome: colaborador.name,
                                                contribuicao: this.getProps(colaborador.itens,"food")
                                            })
                                        }}>
                                            Editar
                                        </Button>
                                        <Button variant="light" onClick={()=> this.deletarColaborador(colaborador.id)}>
                                            Excluir
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>
                <Button type='submit' variant="light" className="mx-5" onClick={()=> {
                    this.showModal()
                    this.reset()
                    }}>
                    Novo Cadastro
                </Button>
            </div>
        )
    }

    /** onChange */
    atualizaCpf = (e) => {
        this.setState(
            {
                cpf: e.target.value
            }
        )
    }

    atualizaNome = (e) => {
        this.setState(
            {
                nome: e.target.value
            }
        )
    }

    atualizaContribuicao = (e) => {
        this.setState(
            {
                contribuicao: e.target.value
            }
        )
    }

    /**
     * valida campos em branco
     * @returns true ou false
     */
    validate = () => {
        if (this.state.cpf == '' || this.state.nome == '' || this.state.contribuicao == '' ){
            return false
        }
            return true
    }

    /**
     * cadastra ou atualiza colaborador
     */
    submit = () => {

        if(this.state.id == null){
            const colaborador = {
                cpf: this.state.cpf,
                name: this.state.nome,
                itens: [{'food': this.state.contribuicao}]
            }
            this.cadastraColaborador(colaborador);

        }else{
            const colaborador = {
                id: this.state.id,
                cpf: this.state.cpf,
                name: this.state.nome,
                itens: [{'food': this.state.contribuicao}]
            }

            this.editarColaborador(colaborador);
        }
        
        this.showModal();
    }

    /**
     * limpa os campos do modal
     */
    reset = () => {
        this.setState(
            {
                id: null,
                cpf:'',
                nome:'',
                contribuicao:''
            }
        )
    }

    /**
     * exibe ou esconde o modal
     */
    showModal = ()=> {
        this.setState(prevState => ({
          modalAberta: !prevState.modalAberta
        })
        );
    
    }

    render(){
        return(
            <div>
                <Modal show={this.state.modalAberta} onHide={()=> this.showModal()}>
                    <Modal.Header closeButton>
                        <Modal.Title>MV Breackfast</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" >
                                <Form.Label>Digite seu CPF:</Form.Label>
                                <Form.Control type="text" placeholder="Ex.:123456789" value={this.state.cpf} onChange={this.atualizaCpf}/>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>Nome:</Form.Label>
                                <Form.Control type="text" placeholder="Ex.:João da Silva" value={this.state.nome} onChange={this.atualizaNome}/>
                            </Form.Group>

                            <Form.Group className="mb-3" >
                                <Form.Label>Contribuição:</Form.Label>
                                <Form.Control type="text" placeholder="Ex.:Pão" value={this.state.contribuicao} onChange={this.atualizaContribuicao}/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit" onClick={()=> this.submit()}>
                            Enviar
                        </Button>
                    </Modal.Footer>
                </Modal>
                {this.renderTable()}
            </div>
        )
    }
}

export default Lista;