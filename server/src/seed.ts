import "dotenv/config";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
async function main(){
 console.log("🌱 Seeding SpendWise database...");
 await prisma.transaction.deleteMany({}); await prisma.budget.deleteMany({}); await prisma.account.deleteMany({}); await prisma.user.deleteMany({});
 const user=await prisma.user.create({data:{name:"Umakant",email:"admin@spendwise.com",password:await bcrypt.hash("demo_password",10),role:"admin",currency:"INR"}});
 const bank=await prisma.account.create({data:{userId:user.id,name:"HDFC Savings",type:"Bank Account",balance:58450}});
 const wallet=await prisma.account.create({data:{userId:user.id,name:"Cash Wallet",type:"Cash",balance:6200}});
 const card=await prisma.account.create({data:{userId:user.id,name:"ICICI Credit Card",type:"Credit Card",balance:-8400}});
 const now=new Date();const ago=(n:number)=>{const d=new Date(now);d.setDate(d.getDate()-n);return d};
 const tx=[
 [bank.id,"Income",32000,"Salary","Monthly Salary",2],[bank.id,"Expense",8500,"Rent","Monthly Rent",3],[bank.id,"Expense",1850,"Food","Groceries",4],[bank.id,"Expense",420,"Transport","Fuel",5],[card.id,"Expense",1299,"Shopping","Clothing Purchase",6],[bank.id,"Expense",799,"Entertainment","Streaming Subscription",7],[wallet.id,"Expense",250,"Food","Lunch",8],[bank.id,"Expense",600,"Transport","Auto & Cab",9],[bank.id,"Expense",1100,"Utilities","Electricity Bill",10],[bank.id,"Expense",699,"Utilities","Internet Bill",11],[bank.id,"Income",2500,"Freelance","Freelance UI Design",13],[wallet.id,"Expense",380,"Food","Restaurant",14],[card.id,"Expense",2400,"Shopping","Electronics",15],[bank.id,"Expense",950,"Health","Pharmacy",16],[bank.id,"Expense",300,"Transport","Metro Recharge",17],[bank.id,"Expense",450,"Entertainment","Movie",18],[bank.id,"Expense",720,"Food","Online Food Order",20],[bank.id,"Expense",1200,"Education","Online Course",21],[wallet.id,"Expense",180,"Food","Coffee & Snacks",23],[bank.id,"Expense",500,"Transport","Fuel",25]
 ] as const;
 for(const [accountId,type,amount,category,description,days] of tx) await prisma.transaction.create({data:{userId:user.id,accountId,type,amount,category,description,date:ago(days)}});
 const month=now.getMonth()+1,year=now.getFullYear();await prisma.budget.createMany({data:[
 {userId:user.id,category:"Food",amount:5000,spent:3150,month,year},{userId:user.id,category:"Transport",amount:2500,spent:1820,month,year},{userId:user.id,category:"Shopping",amount:4000,spent:3699,month,year},{userId:user.id,category:"Entertainment",amount:2000,spent:1249,month,year},{userId:user.id,category:"Utilities",amount:3000,spent:1799,month,year},{userId:user.id,category:"Health",amount:2000,spent:950,month,year}]});
 console.log("✅ SpendWise database seeded successfully!");console.log("User: admin@spendwise.com");console.log("Password: demo_password");console.log("Accounts: 3");console.log("Transactions: 20");console.log("Budgets: 6");
}main().catch(e=>{console.error("❌ Seed failed:",e);process.exit(1)}).finally(async()=>prisma.$disconnect());
