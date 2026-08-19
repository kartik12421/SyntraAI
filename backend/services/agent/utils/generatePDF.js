import PDFDocument from "pdfkit";

export const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margins: 50,
      info: {
        Author: "SyntraAI",
        title: data.title,
        Creator: "SyntraAI",
      },
    });

    const chunks = [];

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on("error", (err) => reject(err));

    // title
    doc
      .fontSize(30)
      .text(data?.title, {
        align: "center",
      })
      .fillColor("#111827");

    if (data?.subtitle) {
      doc.moveDown(1);
    }

    //   subtitle
    doc
      .fontSize(15)
      .text(data.subtitle, {
        align: "center",
      })
      .fillColor("#6B7280");

    doc.moveDown(2);

    //   section
    data?.sections?.forEach((s) => {
      // heading
      doc.fontSize(18).text(s.heading).fillColor("#111827");

      doc.moveDown(0.5);

      //   points
      s?.points.forEach((p) => {
        doc
          .fontSize(12)
          .text("• " + p, {
            lineGap: 4,
          })
          .fillColor("#374151");
      });

      doc.moveDown();
    });

    // footer
    doc.moveDown();
    doc
      .fontSize(10)
      .text(
        "Made with SyntraAI... for any inquiry reach me - kartikjoshi842@gmail.com",
        {
          align: "center",
        },
      )
      .fillColor("#9CA3AF");

    doc.end();
  });
};
