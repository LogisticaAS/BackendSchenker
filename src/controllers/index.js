var express = require('express');
var app = express();
var convert = require("xml-js");
const fs = require("fs");
const path = require("path");
var format = require("xml-formatter");
const xml2js = require("xml2js");
const readXlsxFile = require("read-excel-file/node");


const indexController = (req, res) => {
    var reglas = [];
    readXlsxFile(path.join(__dirname, `../files/reglas.xlsx`)).then((rows) => {
      rows.forEach((row) => {
        if (row[1] != "Country") {
          var regla = {
            country: row[0],
            state: row[1],
            carrier: row[2],
            grupo: row[3],
            linea: row[4],
          };
          reglas.push(regla);
        }
      });
    });
    file = req.files.file;
    promesa = new Promise((resolve, reject) => {
        file.mv(path.join(__dirname,`../files/xml1_${file.name}`));
        setTimeout(() => {
            if (fs.existsSync(path.join(__dirname, `../files/xml1_${file.name}`))) {
                resolve();
            }
        }, 1000);
    });
  // XML string to be parsed to JSON
  // const parser = new xml2js.Parser({ attrkey: "$"});
  promesa.then(()=>{
      let xml_string = fs.readFileSync(path.join(__dirname,`../files/xml1_${file.name}`), "utf8");
      var result1 = convert.xml2json(xml_string, { compact: true, spaces: 4 });
      result1 = JSON.parse(result1);
      const carrier =result1['tns:ShippingDocumentationNotification']['tns:ShippingBusinessDocument']['tns:ShipmentInformation']['tns:RoutingInformation'][0]['upi:PartnerDescription']['upi:KnownPartnerContact']['upi:KnownPartner']['upi:PartnerIdentification']['ulc:AlternativeIdentifier'][0]['ulc:Identifier']._text.trim();
       var partners = result1['tns:ShippingDocumentationNotification']['tns:ShippingBusinessDocument']['tns:ShipmentInformation']['tns:DeclarationInformation']['upi:PartnerDescription'];


        var partnersFiltrados = partners.filter(partner =>
          partner['upi:FullPartner']['upri:ProcessRoleIdentifier']._text.trim() == 'SHT'
        );
        
       const country = partnersFiltrados[partnersFiltrados.length - 1]['upi:FullPartner']['ulc:PhysicalAddress']['uc:Country']._text.trim();

       var state = ''
       if(partnersFiltrados[partnersFiltrados.length - 1]['upi:FullPartner']['ulc:PhysicalAddress']['ucs:CountrySubdivision']._text){
         state = partnersFiltrados[partnersFiltrados.length - 1]['upi:FullPartner']['ulc:PhysicalAddress']['ucs:CountrySubdivision']._text.trim();
       }
        
          carrierEncontrado = reglas.filter(regla => regla.carrier == carrier && regla.country == country);
          // console.log(carrier, country, state);
          // console.log(carrierEncontrado);
          var valid;
          if (carrierEncontrado.length > 0) {
              
              valid = true;
              return res.status(200).json({ status: "ok", valid, carrier, country, state, grupo: carrierEncontrado[0].grupo, linea: carrierEncontrado[0].linea});
          } else {
            valid = false;
              return res.status(200).json({ status: "ok", valid, carrier, country, state});
          }          
  });




  // xml_string = xml_string.replace(':', '');
  // var formattedXml = format(xml_string);
  // console.log(formattedXml);

  // console.log(result1.ShippingDocumentationNotification.DocumentHeader.DocumentInformation.Creation._text.trim());
  // const identifier =
  //   result1.ShippingDocumentationNotification.ShippingBusinessDocument
  //     .ShipmentInformation.RoutingInformation[0].PartnerDescription
  //     .KnownPartnerContact.KnownPartner.PartnerIdentification
  //     .AlternativeIdentifier[0].Identifier._text.trim();
  // var carrier = result.ShippingDocumentationNotification.ShippingBusinessDocument[0]
  //         .ShipmentInformation[0].RoutingInformation[0].PartnerDescription[0]
  //         .KnownPartnerContact[0].KnownPartner[0].PartnerIdentification[0]
  //         .AlternativeIdentifier[0].Identifier[0];

  // console.log(xml_string);
  // parser.parseString(xml_string, function (error, result) {
  //   if (error === null) {
  //     var carrier = result;
  //     console.log(carrier);
  //   }else{
  //     console.log(error);
  //   }
  // });
  //     //header
  //     var documentHeader = {
  //       creation: result.ShippingDocumentationNotification.DocumentHeader[0].DocumentInformation[0].Creation[0].trim(),
  //       documentIdentification: {
  //         identifier: result.ShippingDocumentationNotification.DocumentHeader[0].DocumentInformation[0].DocumentIdentification[0].Identifier[0].trim(),
  //         standardDocumentIdentification:{
  //           standard: result.ShippingDocumentationNotification.DocumentHeader[0].DocumentInformation[0].DocumentIdentification[0].StandardDocumentIdentification[0].Standard[0].trim(),
  //           version: result.ShippingDocumentationNotification.DocumentHeader[0].DocumentInformation[0].DocumentIdentification[0].StandardDocumentIdentification[0].Version[0].trim(),
  //         }
  //       },
  //       receiver: {
  //         partnerIdentification:{
  //           partnerName: result.ShippingDocumentationNotification.DocumentHeader[0].Receiver[0].PartnerIdentification[0].PartnerName[0].trim(),
  //            duns: result.ShippingDocumentationNotification.DocumentHeader[0].Receiver[0].PartnerIdentification[0].DUNS[0]._.trim()
  //         }
  //       },
  //       sender: {
  //         partnerIdentification:{
  //           partnerName: result.ShippingDocumentationNotification.DocumentHeader[0].Sender[0].PartnerIdentification[0].PartnerName[0].trim(),
  //            duns: result.ShippingDocumentationNotification.DocumentHeader[0].Sender[0].PartnerIdentification[0].DUNS[0]._.trim()
  //         }
  //       }
  //     }

  //     var shippingBusinessDocument = {
  //       headerInformation: {
  //         packingList: {
  //           dateTime:
  //             result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].PackingList[0].DateTime[0].trim(),
  //           documenType:
  //             result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].PackingList[0].DocumentType[0].trim(),
  //           identifier:
  //             result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].PackingList[0].Identifier[0].trim(),
  //           line: result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].PackingList[0].Line[0].trim(),
  //           revision:
  //             result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].PackingList[0].Revision[0].trim(),
  //         },
  //         shippingDocument: [
  //           {
  //             dateTime:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[0].DateTime[0].trim(),
  //             documenType:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[0].DocumentType[0].trim(),
  //             identifier:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[0].Identifier[0].trim(),
  //             line: result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[0].Line[0].trim(),
  //             revision:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[0].Revision[0].trim(),
  //           },
  //           {
  //             documenType:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[1].DocumentType[0].trim(),
  //             identifier:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[1].Identifier[0].trim(),
  //             line: result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[1].Line[0].trim(),
  //             revision:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[1].Revision[0].trim(),
  //           },
  //           {
  //             documenType:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[2].DocumentType[0].trim(),
  //             identifier:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingDocument[2].Identifier[0].trim(),
  //           },
  //         ],
  //         shippingOrderInformation: {
  //           orderInformation: {
  //             alternativeIdentifier: {
  //               authority:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].AlternativeIdentifier[0].Authority[0].trim(),
  //               identifier:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].AlternativeIdentifier[0].Identifier[0].trim(),
  //             },
  //             orderAllocationDate:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].OrderAllocationDate[0].trim(),
  //             orderReference: {
  //               dateTime:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].OrderReference[0].DateTime[0].trim(),
  //               documentType:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].OrderReference[0].DocumentType[0].trim(),
  //               identifier:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].OrderReference[0].Identifier[0].trim(),
  //               revision:
  //                 result.ShippingDocumentationNotification.ShippingBusinessDocument[0].HeaderInformation[0].ShippingOrderInformation[0].OrderInformation[0].OrderReference[0].Revision[0].trim(),
  //             },
  //             totalAmount: {
  //               amount:
  //                 result.ShippingDocumentationNotification
  //                   .ShippingBusinessDocument[0].HeaderInformation[0]
  //                   .ShippingOrderInformation[0].OrderInformation[0].TotalAmount[0].Amount[0].trim(),
  //               currency: result.ShippingDocumentationNotification
  //                   .ShippingBusinessDocument[0].HeaderInformation[0]
  //                   .ShippingOrderInformation[0].OrderInformation[0].TotalAmount[0].Currency[0].trim(),
  //             },
  //           },
  //         },
  //       },
  //       shipmentInformation: {
  //         containerTotalCount:
  //           result.ShippingDocumentationNotification.ShippingBusinessDocument[0].ShipmentInformation[0].ContainerTotalCount[0].trim(),
  //         customsInformation: {
  //           customs: {
  //             country:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].ShipmentInformation[0].CustomsInformation[0].Customs[0].Country[0].trim(),
  //             customsType:
  //               result.ShippingDocumentationNotification.ShippingBusinessDocument[0].ShipmentInformation[0].CustomsInformation[0].Customs[0].CustomsType[0].trim(),
  //           },
  //         },
  //       },
  //     };

  //     var carrier = result.ShippingDocumentationNotification.ShippingBusinessDocument[0]
  //         .ShipmentInformation[0].RoutingInformation[0].PartnerDescription[0]
  //         .KnownPartnerContact[0].KnownPartner[0].PartnerIdentification[0]
  //         .AlternativeIdentifier[0].Identifier[0];
  //     carrier = carrier.trim();
  //     console.log(shippingBusinessDocument.headerInformation.shippingOrderInformation.orderInformation.totalAmount);
  //   } else {
  //     console.log(error);
  //   }
  // });
} 

module.exports = {
    indexController
}