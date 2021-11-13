// how to run code in terminal
// node .\newCode.js --source=rawdata.txt
// " npm install minimist" if required

let minimist = require("minimist");
let args = minimist(process.argv);
let fs=require("fs");



//STEP1 READING THE RAW DATA

let stext=fs.readFileSync(args.source,"utf-8");

//STEP2 MAKING AN ARRAY OF OBJECTS

let arr=stext.split("\r\n");
let allInfo=[];

for(let i=0;i<arr.length;i++){
    let newArray=arr[i].split(",");
        let info={
            date:"",
            product:"",
            price:"",
            qty:"",
            total:"",
    
        }
    
        info.date=newArray[0];
        info.product=newArray[1];
        info.price=newArray[2];
        info.qty=newArray[3];
        info.total=newArray[4];
        allInfo.push(info);
    }

    //Step 3 - making Month wise data
    let yearData={};
    let totalSaleofAllMonths=0;

    for(let element of allInfo){

        // 3.1 - Finding Total Sale of All Months
        totalSaleofAllMonths=totalSaleofAllMonths+parseInt(element.total);
       
       //3.2 - Making a Month and Adding TotalSale of that particular month
        let currentmonth=element.date.split("-")[1];

        if(yearData[currentmonth]){
            yearData[currentmonth].TotalSales=yearData[currentmonth].TotalSales +parseInt(element.total);
        }else{
            yearData[currentmonth]={TotalSales:parseInt(element.total)}
        }


        // 3.3 - filling all items info in that particular month 
        fillingInfo(element,currentmonth,yearData)
    }

    //creating JSON
    // let yeardataJSON=JSON.stringify(yearData);

    // fs.writeFileSync("yearData.json",yeardataJSON,"utf-8");


    //Step 4 - Finding All required solutions

    //4.1 => Total Sales of All months

    console.log(`Total Sales of the Store of All Months is ${totalSaleofAllMonths}`);

   

    // remaining qns solutions
    
    for(let months in yearData){
        
        let sum=0;
        let popularitem="";
        let mostQty=0;
        let mostRevenue=0;
        let mostRevenueItem=""


        for(let ele in yearData[months]){
          
            if(ele==="TotalSales"){
                continue;
            }
            else{
                //4.2=> Month wise sales totals.
                sum=sum+(yearData[months][ele].sale)
               
                //4.3=> Most popular item (most quantity sold) in each month.
                if(yearData[months][ele].totalQty>mostQty){
                mostQty=yearData[months][ele].totalQty;
                popularitem=ele;
                }

                //4.4 => Items generating most revenue in each month.

                if(yearData[months][ele].sale>mostRevenue){
                    mostRevenue=yearData[months][ele].sale;
                    mostRevenueItem=ele;
                    }

            }
        }

        //
        let mon=getCurrentMonthName(parseInt(months)-1);
        console.log(`Total sale of ${mon} is ${sum}`);

        console.log(`Most popular item of ${mon} is ${popularitem} having Total qauntity sold ${mostQty}`);

        console.log(`Most Revenue ganerated item of ${mon} is ${mostRevenueItem} having Total rupee  ${mostRevenue}`);


        // 4.5=> For the most popular item, finding the min, max and average number of orders each month.

        let avg=mostQty/yearData[months][popularitem].noOfOrder;

        console.log(`The popular item of ${mon} is ${popularitem} having minimum order of ${yearData[months][popularitem].minOrder} , maximum order of ${yearData[months][popularitem].maxOrder} and average order og ${avg}`);
    
    }
    
          
    



//FUNCTIONS

    function fillingInfo(element,currentmonth,yearData){

        if(yearData[currentmonth][element.product]){

            yearData[currentmonth][element.product].sale = yearData[currentmonth][element.product].sale + parseInt(element.total);

            yearData[currentmonth][element.product].totalQty= yearData[currentmonth][element.product].totalQty + parseInt(element.qty);

            yearData[currentmonth][element.product].minOrder=Math.min(
                yearData[currentmonth][element.product].minOrder,element.qty   
            )

            yearData[currentmonth][element.product].maxOrder=Math.max(
                yearData[currentmonth][element.product].maxOrder,element.qty   
            )
            yearData[currentmonth][element.product].noOfOrder++;

            

        }else{
            yearData[currentmonth][element.product]={
                sale:parseInt(element.total),
                totalQty:parseInt(element.qty),
                minOrder:parseInt(element.qty),
                maxOrder:parseInt(element.qty),
                noOfOrder:1,

            }
        }
    }



    function getCurrentMonthName(dt){
        monthNamelist = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
       return monthNamelist[dt];
      }



