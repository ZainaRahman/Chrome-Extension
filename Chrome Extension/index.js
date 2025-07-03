let myLeads = []
let mySearch=[]
const inputEl = document.getElementById("input-el")
const saveEl = document.getElementById("save-el")
const searchEl = document.getElementById("search-el")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const tabBtn= document.getElementById("tab-btn")
const inputBtn= document.getElementById("input-btn")
const searchBtn= document.getElementById("search-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )


if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){
    chrome.tabs.query({active:true,currentWindow:true},function(tabs){
        myLeads.push({
            url: tabs[0].url,
            title: saveEl.value || tabs[0].url})
        saveEl.value=""
        localStorage.setItem("myLeads",JSON.stringify(myLeads))
        render(myLeads)
        
    })

})


function render(leads) {
    let listItems = ""

     for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i].url}'>
                    🔗 ${leads[i].title}
                </a>
                <span class="delete-individual" data-index="${i}">&times;</span>
            </li>
        `
    }
    ulEl.innerHTML = `<p>Total links added= ${leads.length}</p> ${listItems}`
   
    const deleteIcons = document.querySelectorAll(".delete-individual")
    deleteIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            alert("Link will be deleted. Press OK!")
            const index = this.getAttribute("data-index")
            myLeads.splice(index, 1)
            localStorage.setItem("myLeads", JSON.stringify(myLeads))
            render(myLeads)
        })
    })
}


function searchResults(leads){
    let listItems = ""

     for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i].url}'>
                    🔗 ${leads[i].title}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = `<p>Total results found ${leads.length}</p> ${listItems}`


}

deleteBtn.addEventListener("dblclick", function() {
    alert("Delete button was double-clicked!")
    localStorage.clear()
    myLeads=[]
    inputEl.value=""
    saveEl.value=""
    ulEl.innerHTML=""
    render(myLeads)
})

inputBtn.addEventListener("click", function() {
   
    if(inputEl.value){
    myLeads.push({
        url:inputEl.value,
        title: saveEl.value || inputEl.value})
    inputEl.value = ""
    saveEl.value=""
    localStorage.setItem("myLeads", JSON.stringify(myLeads) )
    render(myLeads)
    }
    else{
        inputEl.value="No input given"
        inputEl.style.color="red"
        inputBtn.style.cursor="not-allowed"
        setTimeout(() => {
            inputEl.value = ""
            inputEl.style.color = "black"
            inputBtn.style.cursor="pointer"
            inputEl.focus()
        }, 1500)
    }
    
  
})

searchBtn.addEventListener("click",function(){
    mySearch = [] 
    for (let i = 0; i < myLeads.length; i++) {
        if ( myLeads[i].title.includes(searchEl.value)) {
            mySearch.push({
                url: myLeads[i].url,
                title: myLeads[i].title
            })
        }
    }

    if (mySearch.length > 0) {
        searchResults(mySearch)
    } else {
        ulEl.innerHTML = "<p>🔍 No matches found.</p>"
    }
})

searchEl.addEventListener("input", function () {
    const keyword = searchEl.value.trim()

    if (keyword === "") {
        render(myLeads) 
    }
})



