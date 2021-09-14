import firebase from "./firebaseConnection";
import { useState, useEffect } from 'react'
import './style.css'



function App() {

  const [idPost,setIdPost]         = useState('');
  const [autor,setAutor]           = useState('');
  const [titulo,setTitulo]         = useState('');
  const [busca ,setBusca]          = useState('');
  const [post, setPost]            = useState([]);
  const [email,setEmail]           = useState('');
  const [password,setPassword]     = useState('');
  const [user, setUser]            = useState(false);
  const [userLogged,setUserLogged] = useState({})
  const [nome,setNome]             = useState('');
  const [cargo,setCargo]           = useState('');
  const [infoUser,setInfoUser]     = useState({});

  useEffect(()=>{
    async function loadPosts(){
    firebase.firestore().collection('post')
    .onSnapshot((item)=>{
      let myposts = [];

      item.forEach((items)=>{
        myposts.push({
          id: items.id,
          autor: items.data().autor,
          titulo: items.data().titulo,
        })
      })
      setPost(myposts);
    })
  }
    loadPosts();
  },[])

  useEffect(()=>{

    async function checkLogin(){
      await firebase.auth().onAuthStateChanged((user)=>{
        if(user){
          setUser(true);
          setUserLogged({
            uid: user.uid,
            email : user.email
          })
        }else{
          setUser(false);
          setUserLogged({});
        }
      })
    }
    checkLogin();
  },[])

  async function handleAdd(){
    await firebase.firestore().collection('post').add({
      autor: autor,
      titulo: titulo,

    }).then(()=>{
      console.log('Cadastrado com sucesso!');
      setAutor('');
      setTitulo('');
      
    }).catch((error)=>
      console.log('erro encontrado: '+ error)
    )
  }

  async function buscarPost(){
        //BUSCAR UM ITEM ESPECIFICO DENTRO DO FIREBASE
        await firebase.firestore().collection('post')
        .doc(busca).get()
        .then((snapshot)=>{
          setTitulo(snapshot.data().titulo)
         setAutor(snapshot.data().autor)
        })
        .catch((error)=>{
          console.log('erro detectado: '+ error)
        })

    

      }

  async function editarPost(){
    await firebase.firestore().collection('post')
    .doc(idPost)
    .update({
      autor: autor,
      titulo: titulo,
    }).then(()=>{
      console.log('Dados atualizados com sucesso!')
      setIdPost('');
      setTitulo('');
      setAutor('');

    }).catch((error)=>{
      console.log('Error : '+error)
    })
    
  }
  async function excluirPost(id){
    await firebase.firestore().collection('post').doc(id)
    .delete()
    .then(()=>{
      console.log('Item '+id+' deletado com sucesso')
    })
  }

  async function cadastrarUser(){
    await firebase.auth()
    .createUserWithEmailAndPassword(email,password)
    .then(async(item)=>{
      await firebase.firestore().collection('users').doc(item.user.uid)
      .set({
        nome:   nome,
        cargo:  cargo,
        status: true,
      }).then(()=>{
        setNome('');
        setCargo('');
      })
    }).catch((error)=>{
      if(error.code ==='auth/email-already-in-use'){
        alert('Email já em uso!')
        
      }else if(error.code ==='auth/weak-password'){
        alert('Senha muito fraca, tenta outra por favor.')
      }
    })
  }
  async function logOut(){
    await firebase.auth().signOut();
    setInfoUser({})
  }
  
  async function logIn(){
    await firebase.auth().signInWithEmailAndPassword(email,password)
    .then(async(event)=>{
      await firebase.firestore().collection('users').doc(event.user.uid).get()
      .then((snapshot)=>{
        setInfoUser({
          nome    : snapshot.data().nome,
          cargo   : snapshot.data().cargo,
          status  : snapshot.data().status,
          email   : event.user.email,
        })
      })
    }).catch(()=>{
      console.log('error')
    })
  }

  return(

    
    <div>
      <h1>ReactJs+ Firebase</h1>
      {user &&(
          <div>
            <strong>Voce está logado com {userLogged.uid}- {userLogged.email}</strong>
          </div>
        )}
      <div className='container'>

        <label>Nome: </label>
        <input type='text' value={nome} onChange={(item)=>setNome(item.target.value)}/><br/>

        
        <label>Cargo: </label>
        <input type='text' value={cargo} onChange={(item)=>setCargo(item.target.value)}/><br/>


        <label>EMail:</label>
        <input type='text' value={email} onChange={( item )=>setEmail( item.target.value )}/><br/>

        <label>password:</label>
        <input type='password' value={password} onChange={(item)=>setPassword( item.target.value )}/>

        <button onClick={logIn}>fazer login</button>
        <button onClick={cadastrarUser}>Cadastrar</button>
        <button onClick={logOut}> Log Out!</button>

        {Object.keys(infoUser).length >0 && (
          <div>
            <strong>Olá</strong>{infoUser.nome}<br/>
            <strong>Cargo: </strong>{infoUser.cargo}<br/>
            <strong>Email: </strong>{infoUser.email}<br/>
            <strong>Status: </strong>{String(infoUser.status)}<br/>
          </div>
        )}

        
      </div>

      <div className='container'>
        <hr></hr>
        <br></br>
        <h1>Banco de dados</h1>

        <label>ID: </label>
        <input type='text' value={idPost} onChange={(item)=>setIdPost(item.target.value)}/>

        <label>Titulo</label>
        <textarea type='text' value={titulo} onChange={(item)=> setTitulo(item.target.value)}/>

        <label>Autor</label>
        <input type='text' value={autor} onChange={(item)=> setAutor(item.target.value)}/>

        <button onClick={handleAdd}>Submite</button><br/>

        <label>Buscar item</label>
        <input type='text' value={busca} onChange={(item)=> setBusca(item.target.value)}></input>
        <button onClick= {buscarPost}> Buscar post</button>
        <button onClick= {editarPost}> Editar post</button>

        <ul>{post.map((item)=>{
          return(
            <li key= {item.id}>
              <span>ID     : {item.id}</span><br/>
              <span>Autor  : {item.autor}</span><br/>
              <span>Titulo : {item.titulo}</span><br/>
              <button onClick={()=>{excluirPost(item.id)}}>excluir item</button><br></br><br/>
            </li>
          )
        })}</ul>

      </div>
    </div>
  )
}


export default App;
