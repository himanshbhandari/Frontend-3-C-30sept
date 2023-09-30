const apiKey="nTTT2rKYrKwQ6AwziroHK1acLlgKRdOooj4kHzTS";

//find current date here
const currentDate=new Date();

//html elements
const image=document.getElementById("image");
const title=document.getElementById("title");
const description=document.getElementById("description");
const dateInput=document.getElementById("date-input");
const  searchBtn=document.getElementById("search-btn");
const searchHistoryContainer=document.getElementById("search-history");
const prevSearch=document.getElementById("previous-search");
const pageHeading=document.getElementById("page-heading");
const clearHistoryBtn=document.getElementById("clear-search-btn");
const loader=document.getElementById("loader-sec");
const mainPage=document.getElementById("main-page")


//render search history from local Storage;
function renderSearchHistory(){
    let localDataArr=JSON.parse(localStorage.getItem("search"));

    //if localSotrage is not empty
    if(localDataArr!==null){
        localDataArr.forEach((ele,index)=>{
            // console.log(ele);
            createSearchHistory(ele.date);
        })

    }
        
}
renderSearchHistory();


let searchArr=[];
if(localStorage.getItem("search")){
    searchArr=JSON.parse(localStorage.getItem("search"));
}

//store date in localStorage
function storeDate(data){
    let obj={date:data}
    searchArr.push(obj);
    localStorage.setItem('search',JSON.stringify(searchArr))
}



//it give use date year-month-date format
function formDate(date,month,year){
    if(!date || !month ||  !year){
        return `${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`
    }

}


let today=formDate();
// console.log(today);


//fetch api here
async function fetchData(today){
    try{
        loader.style.display="flex";
        mainPage.style.display="none";
        const response=await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${today}`);
        const data=await response.json();
        renderData(data); 

    }   
    catch{
        alert("some error occured");
    }
};
fetchData(today);


//rendering data here which is coming from nasa api
function renderData(obj){

    loader.style.display="none";
    mainPage.style.display="block";
    
    // console.log(obj);
    image.src=obj.url;
    title.innerText=obj.title;
    description.innerText=obj.explanation;   

}

//update previous history
function createSearchHistory(userDate){
    const p=document.createElement("p");
    p.innerText=userDate;
    p.setAttribute("id","previous-search");
    p.setAttribute("onclick","searchHistory(event)")
    searchHistoryContainer.appendChild(p);

}

//update heading 
function updateHeading(userDate){
    pageHeading.innerText=`Picture on ${userDate}`

}

//search button functionality
searchBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    // console.log(dateInput.value);
    let userDate=dateInput.value;
    
    if(userDate)
    {
        fetchData(userDate)
        storeDate(userDate)
        createSearchHistory(userDate)
        updateHeading(userDate);
        dateInput.value="";

    }
    else{
        alert("enter date first")
    }

})


//when click on search history
function searchHistory(event){
    const srchHist=event.target.innerText;
    fetchData(srchHist);
    createSearchHistory(srchHist);
    storeDate(srchHist);
    updateHeading(srchHist);
}


//render after clearing the local storage
function cleanHistory(){
    searchHistoryContainer.innerHTML=`<h4 class="text-center  p-3 mt-4 bg-dark text-light">Previous-search</h4>`;
    
}

//clear localStorage
clearHistoryBtn.addEventListener("click",()=>{
    localStorage.clear();
    if(!prevSearch){
        cleanHistory();
    }
    
})