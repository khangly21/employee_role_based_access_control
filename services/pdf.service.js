//https://youtu.be/fKewAlUwRPk

//https://github.com/foliojs/pdfkit 👉 scroll down xem hướng dẫn các câu lệnh , Features
PDFDocument= require('pdfkit');

//we don't create pdf inside server, we write it to the client . So we use callback
function buildPDF(dataCallback,endCallback){ //WHO CALLS? 
    const doc=new PDFDocument();
    //Once doc receive some data, so once a small part of the pdf has been generated 👉 invoke the callback 
    doc.on('data',dataCallback);
    //If everything is done (kết thúc đọc)
    doc.on('end',endCallback);
    //👉 these callbacks are very important, because we pass these callbacks from express handlers, which means express handler is just gonna receive the data. It is gonna send it back to the client and once it's done it's gonna terminate the connection
    //👉 we don't buffer the COMPLETE file in server memory (chính là tự động tạo pdf file trong file system output.pdf đã làm) before sending 
    //👉 we basically send data back to client (and browser then reassembles it) as we receive it (=as soon as), not buffer data (pdf chunks) inside memory
    //👉 this is a very efficient way of doing it 

    // Embed a font, set the font size, and render some text
    doc.fontSize(25)
       .text(`
            <h1>Some heading!</h1>
            <p>Lý Viết Khang</p>
        `);
        //Muốn vẽ table thì https://stackoverflow.com/questions/23625988/html-table-in-pdfkit-expressjs-nodejs

    //we will create a pdf and we add like a heading to it 
    doc.end();
}

//let's export this function as well (chỉ export 1 function thôi thì dùng module.exports, nhiều function thì dùng export function x(){} )
module.exports={buildPDF};