PDFDocument= require('pdfkit');

//we don't create pdf inside server, we write it to the client . So we use callback
function buildPDFchoTokhai(dataCallback,endCallback,object){
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
    //font('Times-Roman'), các lựa chọn khác là https://pdfkit.org/docs/text.html#fonts
    //The PDF format defines 14 standard fonts that can be used in PDF documents. PDFKit supports each of them
   doc.image('sunrise.PNG', {
      fit: [400, 300],
      align: 'center',
      valign: 'center'
   })
   .font('Times-Roman').fontSize(12) //font này không hỗ trợ Vietnamese, mặc dù object.Ten_nhan_vien_thuc_hien_to_khai là "Thái thế hiền Thục"
       .text(`
                Tờ khai sức khỏe Covid-19
                   TPHCM, ngày ${new Date()}
                Nguồn: Nhân viên ${object.Ten_nhan_vien_thuc_hien_to_khai}  
        `)
       .image('sunset.PNG', {
         fit: [400, 300],
         align: 'center',
         valign: 'center'
      });
      

        x1=doc.x;
        x6=300;  //chính là height của ô cột 2
        doc.rect(doc.x, doc.y, 450, 65)
           .moveTo(600, doc.y).lineTo(600, doc.y+65)
           .moveDown(0.2)
           
           //TÊN NHÂN VIÊN
           .text('Tên nhân viên',{indent:5, align:'left',width:140, height:doc.currentLineHeight()}) //(*) chỉ là tượng trưng , thực ra dữ liệu phụ thuộc cột (**). Sự phụ thuộc chấm dứt khi controller truyền dữ liệu cho cột (**).//fontSize 25 thì chỉ chứa được "Ten nhan"
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.Ten_nhan_vien_thuc_hien_to_khai}`,x6,doc.y) //(**) dữ liệu cột 2 quyết định dữ liệu cột 1, VD member_nam thì cột 1 phải là Member ID
           .moveDown(0.2)
           //MÃ NHÂN VIÊN
           .text('Mã nhân viên',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.Ma_nhan_vien}`,x6,doc.y)
           .moveDown(0.2)
           //THÂN NHIỆT
           .text('Thân nhiệt',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.Than_nhiet}`,x6,doc.y)
           .moveDown(0.2)
           //VACCINE MŨI 1
           .text('Vaccine mũi 1',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.HangSX_mui_1}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           .text('Ngày tiêm mũi 1',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.NgaySX_mui_1}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           //VACCINE MŨI 2
           .text('Vaccine mũi 2',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.HangSX_mui_2}`,x6,doc.y)
           //.stroke()
           .moveDown(0.5)

           .text('Ngày tiêm mũi 2',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.NgaySX_mui_2}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           //VACCINE MŨI 3
           .text('Vaccine mũi 3',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.HangSX_mui_3}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           .text('Ngày tiêm mũi 3',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.NgaySX_mui_3}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           //VACCINE MŨI 4
           .text('Vaccine mũi 4',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.HangSX_mui_4}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           .text('Ngày tiêm mũi 4',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.NgaySX_mui_4}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)

           //KẾT QUẢ XÉT NGHIỆM
           .text('Kết quả xét nghiệm covid',x1,doc.y,{indent:5, align:'left',width:140, height:doc.currentLineHeight()})
           .rect(x1,doc.y,450,0.5)
           .moveUp()
           .text(`${object.KETQUAXETNGHIEM}`,x6,doc.y)
           //.stroke()
           .moveDown(0.2)


      doc.image('sky.PNG', {
            fit: [400, 300],
            align: 'center',
            valign: 'center'
         });
         
    //TÀI LIỆU THAM KHẢO
    //doc.fontSize(11).text("https://stackoverflow.com/questions/42665724/how-to-create-a-flexible-table-in-pdf-file-using-pdfkit-nodejs")
    //we will create a pdf and we add like a heading to it
    
   
   doc.end();
}

//let's export this function as well (chỉ export 1 function thôi thì dùng module.exports, nhiều function thì dùng export function x(){} )
module.exports={buildPDFchoTokhai};