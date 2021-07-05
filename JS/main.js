// here I am going to follow modular pattern to make our code more robust


// module for controlling data related with app
var budgetModule = ( function () {

    // to create income object
    function Income(id,desc,value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }


    // to create expense object
    function Expense(id,desc,value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }


    // global datastructure 
    var allData = {
        totals : {
            inc : [],
            exp : []
        },
        inc : 0,
        exp : 0,
        budget : 0
    }


    // function to calculate total income and total expense 
    function total (type) {

        var totalvalue = 0;

        allData.totals[type].forEach(item => {
            totalvalue += item.value;
        });
        allData[type] = totalvalue;
    }



    return {

        storeData (input) {
            var ID; 
            // generating id 
            if(allData.totals[input.type].length === 0) {
                ID = 0
            } else {
                ID = allData.totals[input.type][allData.totals[input.type].length - 1].id + 1;
            }
            
            // creating object based of input type
            if (input.type === "inc") {
                var budgetObject = new Income(ID, input.desc, input.value);
            } else {
                var budgetObject = new Expense(ID, input.desc, input.value);
            }

            // pushing the object in the data-structure
            allData.totals[input.type].push(budgetObject);

            return budgetObject;
        },

        calculateBudget () {
            //calculating income and expense
            total('inc');
            total('exp');

            // calculating the budget
            allData.budget = allData.inc - allData.exp;

            // returning the income expense and total budget
            return [allData.inc, allData.exp, allData.budget];   //returning an array
        },

        deleteItem(type,ID) {

            // storing ids of all the items in an array
            var ids = allData.totals[type].map(obj => {
                return obj.id;
            });

            // finding index of budget item based on the id 
            var index = ids.indexOf(ID);

            // deleting the item from the data-structure
            allData.totals[type].splice(index,1);
        },

        testMethod () {
            return allData;
        }

    }
       
}());



// module for controlling ui
var UIModule = (function () {
    var selectors = {
        type : '.budget__type',
        desc : '.budget__desc',
        value : '.budget__amount',
        addBtn : '.budget__add__btn',
        budgetItems : '.budget__items__card',
        budgetFields : '.field',
        totalAmount : '.total__amount',
        incomeAmount : '.income__amount',
        expenseAmount : '.expense__amount'
    }




    // returning the input from the respective fields
    return  {
        getInput() {
            return {
                type : document.querySelector(selectors.type).value,
                desc : document.querySelector(selectors.desc).value,
                value : +document.querySelector(selectors.value).value  //Unary operator for conversion of string into number
            }
        },

        displayInput(type,obj) {

            var html;

            if(type === "inc") {
                html = `<div class="income__item budget__item" id="inc-${obj.id}"><p class="income__description">${obj.desc}</p><p class="income__amount">${obj.value}/-</p><button class="income__delete__btn delete__btn"><span class="material-icons income__icon">delete</span></button></div>`
            } else if(type === "exp") {
                html = `<div class="expense__item budget__item" id="exp-${obj.id}"><p class="expense__description">${obj.desc}</p><p class="expense__amount">${obj.value}/-</p><button class="expense__delete__btn delete__btn"><span class="material-icons expense__icon">delete</span></button></div>`
            }
            document.querySelector(selectors.budgetItems).insertAdjacentHTML("beforeend",html);
        },

        clearFields () {
            document.querySelectorAll(selectors.budgetFields).forEach(field => field.value = '')
            document.querySelector(selectors.desc).focus()
        },

        dispalyBudget(dataArray) {
        
            document.querySelector(selectors.incomeAmount).textContent = `${dataArray[0]}/-`;
            if(dataArray[1] > 0) {
                document.querySelector(selectors.expenseAmount).textContent =  `${dataArray[1]}/-`;
            } else {
                document.querySelector(selectors.expenseAmount).textContent = '---';
            }        
            document.querySelector(selectors.totalAmount).textContent =  `${dataArray[2]}/-`;   
        },

        removeItem(id) {
            var parent = document.querySelector(selectors.budgetItems);
            parent.removeChild(parent.querySelector(`#${id}`));

        },

        getSelectors () {
            return selectors;
        },

    }
}());




// module for event handling
var AppModule = (function (budgetMod, UIMod) {

    // selectors
    var selectors = UIMod.getSelectors();


    // event handler for receiving input from the input fields
    document.querySelector(selectors.addBtn).addEventListener('click',InputData);

    document.addEventListener('keydown',function (e) {
        if(e.key === "Enter") InputData();
    });

    // event handler for deleting budget item
    document.querySelector(selectors.budgetItems).addEventListener('click',delBudgetItem);


    function InputData () {

        //get input from the fields
        var inputValues = UIMod.getInput();

        if(inputValues.desc !== '' && inputValues.value > 0) {
            //add item in the datastructure
            var budgetObject = budgetMod.storeData(inputValues);

            //add item in the ui
            UIMod.displayInput(inputValues.type,budgetObject);

            //clear the input fields
            UIMod.clearFields();

            //budget Calculation
            calcBudget();

        }

    }

    // function related with calculate budget
    function calcBudget() {

        //calculate budget
        var allTotals = budgetMod.calculateBudget();

        //display budget
        UIMod.dispalyBudget(allTotals)
    }
    

    // function to delete budget item
    function delBudgetItem(e) {
        //getting id of the item
        var ID = e.target.parentNode.parentNode.id;
        
        // splitting the id
        let [itemType, itemId] = ID.split("-"); 
       
        //deleting the item from the datasturcture
        budgetMod.deleteItem(itemType,+itemId);

        // deleting the item from ui
        UIMod.removeItem(ID);
    }



    return {
        init() {
            
            UIMod.dispalyBudget([0,0,0]);
        }
    }

}(budgetModule, UIModule));

AppModule.init();







// You can use getElementById only with document object, let me show you what I mean

<div class="parent">

    <p id="child">You can't use getElementById as a method to select child of a parent</p>

</div>


// parent selection
let parent = document.querySelector('.parent');


// child
//It will return Uncaught TypeError 
let child = parent.getElementById('child');   


// Instead You can use other method like querySelector etc. to select that child
let child = parent.querySelector('#child');