import React, { useEffect, useState } from "react";
import api from './Api';
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from "react-router-dom";

// CONECÇÃO COM API
/*class App extends Component{

  state={
    colaboradores: [],
  }

  async componentDidMount(){
    const response = await api.get('')

    console.log(response.data)

    this.setState({colaborador: response.data})
  }

  render(){
    return(
      <div>
        <h1>lista</h1>
      </div>
    )
  }
}*/

// LINKA AS PAGES
export default function App() {

  const [
    colaboradores, setColaboradores
  ]= useState([])

  useEffect( ()=>  {
    
    async function fetchData() {

      const response = await api.get('/colaborador')

      // console.log(response.data)
      setColaboradores(response.data)
    }
    fetchData()

  },[colaboradores])

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Cad />} />
        <Route path='/list' element={<List colaboradores={colaboradores} setColaboradores={setColaboradores} />} />
      </Routes>
    </BrowserRouter>
  );
}

// PAGES CRUD
function Cad() {

  const [cpf, setCpf] = useState('')
  const [name, setName] = useState('')
  const [food, setFood] = useState('')

  const novoColaborador = async () => {
    const response = await api.post('/colaborador', {cpf, name, itens: [{food}]});
    console.log('response', response);
  }

  return<div class="modal modal-signin position-static d-block bg-secondary py-5" tabindex="-1" role="dialog" id="modalSignin">
          <div class="modal-dialog" role="document">
            <div class="modal-content rounded-5 shadow">
              <div class="modal-header p-5 pb-4 border-bottom-0">
                <h2 class="fw-bold mb-0">Café da Manhã</h2>
                <Link to='/list'>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </Link>
              </div>

              <div class="modal-body p-5 pt-0">
                <form class="">
                  <div class="form-floating mb-3">
                    <input type="cpf" 
                      value={cpf} onChange={(e) => setCpf(e.target.value)} 
                      class="form-control rounded-4" id="floatingInput" placeholder="name@example.com"/>
                    <label for="floatingInput">CPF</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="name" 
                      value={name} onChange={(e) => setName(e.target.value)} 
                      class="form-control rounded-4" id="floatingInput" placeholder="name@example.com"/>
                    <label for="floatingInput">Nome do Colaborador</label>
                  </div>
                  <div class="form-floating mb-3">
                    <input type="name" 
                      value={food} onChange={(e) => setFood(e.target.value)} 
                      class="form-control rounded-4" id="floatingPassword" placeholder="Contribuição"/>
                    <label for="floatingPassword">Contribuição</label>
                  </div>
                  <button class="w-100 mb-2 btn btn-lg rounded-4 btn-primary" onClick={() => novoColaborador()}>Enviar</button>
                  <small class="text-muted">Ao clicar em Enviar, você estará contribuindo para nosso café da manhã.</small>
                  <hr class="my-4"/>
                </form>
              </div>
            </div>
          </div>
        </div>;
}

const getProps = (arr, prop) => {
  let str = '';

  arr.forEach(a => {
    str += `${a[prop]}/`;
  })

  if (str.endsWith('/')) str = str.substring(0, str.length - 1);

  return str;
}

// PAGE LIST
function List(props) {
  // console.log(props)
  let colaboradores = null
  if(props?.colaboradores?.length > 0){
    colaboradores = props.colaboradores
  }

  let setColaboradores = null
  if(props?.setColaboradores?.length > 0){
    setColaboradores = props.setColaboradores
  }

  const remove = async (id) => {
    const response = await api.delete(`/colaborador?id=${id}`);

    if (response.data) setColaboradores(colaboradores.splice(colaboradores.indexOf(c => c.id === id)))
  }


  return (
    <div>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">CPF</th>
            <th scope="col">Colaborador</th>
            <th scope="col">Contribuição</th>
          </tr>
        </thead>
        <tbody>
          {
            colaboradores?.map(colaborador => (
              <tr key={colaborador.id}>
                <th scope="row">{colaborador.id}</th>
                <td>{colaborador.cpf}</td>
                <td>{colaborador.name}</td>
                <td>{getProps(colaborador.itens, "food")}</td>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => remove(colaborador.id)}></button>
              </tr>
            ))
          }
        </tbody>
      </table>
      <div class="d-grid gap-2 d-md-flex justify-content-md-end">
        <Link to='/'>
        <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="close">Novo Cadastro</button>
        </Link>
      </div>
    </div>
  )
}