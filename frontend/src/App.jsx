import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(false);
  const [otp, setOtp] = useState();
  const [send, setSend] = useState("0");


const userData = JSON.parse(localStorage.getItem("userData"));
if(!userData){
  console.log("hujefe")
  localStorage.setItem(
    "userData",
    JSON.stringify({ isLoggedIn: false, eventUrl: ""})
  );
}
console.log(userData.isLoggedIn, userData.eventUrl);


  useEffect(() => {
    axios.get("https://sydneyeventsapi.onrender.com/api/events")
      .then(res => setEvents(res.data))
      .catch(err=>console.log("error ", err));
  }, []);

  const handleClick = async (eventUrl) => {
    if (!userData.isLoggedIn){ 
        setPage(true);
        userData.eventUrl = eventUrl;
        localStorage.setItem("userData", JSON.stringify(userData));
      return;
    }
    window.location.href = eventUrl;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setSend("2");
    const res = await axios.post("https://sydneyeventsapi.onrender.com/api/login", {
      email,
      otp
    });
    // data = await res.json();
    setSend("0");
    setPage(false);
    alert(res.data.msg);
    setEmail("");
    setOtp("");

     if(res.data.status){
         userData.isLoggedIn = true
          localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = userData.eventUrl;
     }
  }

  const handleSendOtp = async () => {
    if(email === "")  return alert("Please enter your email");

    setSend("1");
    const res = await axios.post("https://sydneyeventsapi.onrender.com/api/sendotp", {
      email
    });
    alert(res.data.msg);

  }

  return (
   <div className="flex relative flex-col items-center">
      <div className=" text-[#582f0e] text-lg lg:text-2xl flex mt-4 items-center gap-3 mb-8 font-medium px-6 py-2 shadow-sm border border-gray-300 bg-white rounded-lg ">
        <h1 className="">Explore events in sydney</h1>
        <i class="fa-solid fa-calendar-days"></i>
      </div>
      <div className="flex lg:px-28 p-2 flex-wrap gap-8 justify-center">
        {
        events.map((item, ind)=>{
          return (<div key={ind} className="bg-white max-w-[350px]  max-h-[400px] rounded-lg hover:shadow-lg transition duration-200 border border-gray-300">
            <img className=" h-[200px] w-[350px] rounded-lg"
            src={item.img} alt="" />
            <div className="p-3">
              <h3 className=" pb-2 border-b border-gray-300 truncate-2-lines text-lg text-[#3a3247] font-semibold">{item.title}</h3>
              <p className="text-base mt-2 text-gray-700">{item.date}</p>
              <button onClick={()=>handleClick(item.url)} className="px-4 py-2 rounded-lg transition mt-3 bg-[#7b2cbf] duration-200 hover:bg-[#240046] text-white font-medium cursor-pointer">Get tickets</button>
            </div>
          </div>)
        })
      }
      </div>

      <div className={`${page?'flex':'hidden'} w-full h-full  justify-center items-center fixed  top-0 left-0 bg-gray-900/50`}>
        <button onClick={()=>setPage(false)} className={` fixed lg:top-32 top-2 lg:right-32 right-2 bg-white size-12 rounded-full font-medium text-lg`} type="button">X</button>
        <form onSubmit={handleLogin} className="p-4 rounded-lg bg-white" action="">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Enter your email</label>
            <input
             id="email"  placeholder="Enter your email" required={true} type="email"
             onChange={(e)=>setEmail(e.target.value)}
             value={email}
             className="p-3 outline-none rounded-md w-[300px] bg-gray-200" />
          </div>
          <div className="flex mt-4 mb-4 flex-col gap-2">
            <label htmlFor="otp">Enter otp</label>
            <input
            onChange={(e)=>{
              const value = e.target.value.toString();
              if (value.length <= 6) {
                setOtp(value);
              } 
            }}
            value={otp} required={true}
            id="otp" className="p-3 outline-none rounded-md w-[100px] bg-gray-200" placeholder="326872"  type="number" />
          </div>
            <button onClick={handleSendOtp} type="button"  className="px-3 mr-3 w-fit py-1 rounded-lg bg-green-800 font-medium text-white">Send otp</button>
            <button type="submit"  className="px-3  w-fit py-1 rounded-lg bg-blue-800 font-medium text-white">Verify otp</button>
            <p className="mt-2 text-gray-500">{send==="1"?'Sending otp please wait.. check email in spam':send==="2"?'Verifying otp please wait':''}</p>
        </form>
      </div>

   </div>
  );
}
export default App;
