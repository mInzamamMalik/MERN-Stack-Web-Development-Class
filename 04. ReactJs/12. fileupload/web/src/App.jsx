import './App.css';
import axios from 'axios';

function App() {

  const doSignup = async (e) => {
    e.preventDefault();

    var profilePictureInput = document.getElementById("profilePictureInput");
    console.log("fileInput: ", profilePictureInput.files); // local url

    let formData = new FormData();
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax


    formData.append("name", "malik"); // this is how you add some text data along with file
    formData.append("email", "malik@sysborg.com"); // this is how you add some text data along with file
    formData.append("password", "12345"); // this is how you add some text data along with file
    formData.append("profilePicture", profilePictureInput.files[0]); // file input is for browser only, use fs to read file in nodejs client


    axios({
      method: 'post',
      url: "http://localhost:5001/signup",
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
      // withCredentials: true
    })
      .then(res => {
        console.log(`upload Success` + res.data);
      })
      .catch(err => {
        console.log(err);
      })
  }


  return (
    <div>

      <form onSubmit={doSignup}>
        Name: <input name="name" type="text" placeholder="Name" id='name' />
        <br />
        Email: <input name="email" type="email" placeholder="Email" id='email' />
        <br />
        Password: <input name="password" type="password" placeholder="Password" id='password' />
        <br />

        Profile Picture: <input type="file" id="profilePictureInput" accept='image/*'
          onChange={() => {
            ////// to display imager instantly on screen
            var profilePictureInput = document.getElementById("profilePictureInput");
            var url = URL.createObjectURL(profilePictureInput.files[0])
            console.log("url: ", url);
            document.getElementById("img").innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `
          }} />

        <div id="img"></div>

        <br />
        <button type='submit'>Signup</button>
      </form>





      {/* <div>Cloudinary Demo</div>

      <img
        width="200px"
        src="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/laptop.jpeg?alt=media&token=0005799a-2099-4eec-8918-56f0a20bbff1"
        alt="" />
      <br />
      <img
        width="200px"
        src="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/nature.jpeg?alt=media&token=18fc659f-5186-443e-ab5b-633d2039d94c"
        alt="" />
      <br />
      <img
        width="200px"
        src="https://res.cloudinary.com/malikasinger/image/upload/v1665676922/laptop_lsqoem.jpg"
        alt="" />

      <br />

      <a
        style={{
          border: "1px solid black",
          borderRadius: "20px",
          padding: "5px",
          margin: "20px",
          marginTop: "20px",
          display: "inline-block"
        }}
        href="https://firebasestorage.googleapis.com/v0/b/ecom-25516.appspot.com/o/fontawesome-free-6.1.1-web.zip?alt=media&token=7ce3812c-af48-4a08-be3a-c7c0a311d0e8"
      > Download zip file</a> */}
    </div>
  );
}

export default App;
