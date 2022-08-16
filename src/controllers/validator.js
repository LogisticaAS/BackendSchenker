var express = require("express");
var app = express();
var convert = require("xml-js");
const fs = require("fs");
const path = require("path");
var format = require("xml-formatter");
const xml2js = require("xml2js");
const readXlsxFile = require("read-excel-file/node");
const con = require("../assets/sql");

const validatorController = (req, res) => {
  var reglas = [];
  readXlsxFile(path.join(__dirname, `../files/reglas.xlsx`)).then((rows) => {
    rows.forEach((row) => {
      if (row[1] != "Country") {
        var regla = {
          country: row[0],
          state: row[1],
          carrier: row[2],
          grupo: row[3].trim(),
          linea: row[4].trim(),
        };
        reglas.push(regla);
      }
    });
  });
  var files = [];
  if (Array.isArray(req.files.files)) {
    files = req.files.files;
  } else {
    files.push(req.files.files);
  }

  generalPromise = new Promise(function(resolve, reject) {
    var resFiles = [];
    var i = 0;
    files.forEach((file) => {
      promesa = new Promise((resolve, reject) => {
        file.mv(path.join(__dirname, `../files/${file.name}`));
        setTimeout(() => {
          if (
            fs.existsSync(path.join(__dirname, `../files/${file.name}`))
          ) {
            resolve();
          }
        }, 1000);
      }).then(() => {
        let xml_string = fs.readFileSync(
          path.join(__dirname, `../files/${file.name}`),
          "utf8"
        );
        var result1 = convert.xml2json(xml_string, {
          compact: true,
          spaces: 4,
        });
        result1 = JSON.parse(result1);
        const carrier =
          result1["tns:ShippingDocumentationNotification"][
            "tns:ShippingBusinessDocument"
          ]["tns:ShipmentInformation"]["tns:RoutingInformation"][0][
            "upi:PartnerDescription"
          ]["upi:KnownPartnerContact"]["upi:KnownPartner"][
            "upi:PartnerIdentification"
          ]["ulc:AlternativeIdentifier"][0]["ulc:Identifier"]._text.trim();
        var partners =
          result1["tns:ShippingDocumentationNotification"][
            "tns:ShippingBusinessDocument"
          ]["tns:ShipmentInformation"]["tns:DeclarationInformation"][
            "upi:PartnerDescription"
          ];

        var partnersFiltrados = partners.filter(
          (partner) =>
            partner["upi:FullPartner"][
              "upri:ProcessRoleIdentifier"
            ]._text.trim() == "SHT"
        );

        const country =
          partnersFiltrados[partnersFiltrados.length - 1]["upi:FullPartner"][
            "ulc:PhysicalAddress"
          ]["uc:Country"]._text.trim();

        var state = "";
        if (
          partnersFiltrados[partnersFiltrados.length - 1]["upi:FullPartner"][
            "ulc:PhysicalAddress"
          ]["ucs:CountrySubdivision"]._text
        ) {
          state =
            partnersFiltrados[partnersFiltrados.length - 1]["upi:FullPartner"][
              "ulc:PhysicalAddress"
            ]["ucs:CountrySubdivision"]._text.trim();
        }

        carrierEncontrado = reglas.filter(
          (regla) => regla.carrier == carrier && regla.country == country
        );
        var valid;

        var resFile;
        if (carrierEncontrado.length > 0) {
          valid = true;
            con.query(
              "INSERT INTO document (name, country, state, carrier, line, grupo, valid) VALUES (?,?,?,?,?,?,?)",
              [
                file.name,
                country,
                state,
                carrier,
                carrierEncontrado[0].linea,
                carrierEncontrado[0].grupo,
                valid
              ],
              (error, results) => {
                if (error) throw error;
                if (results[0]) {
                }
              }
            );
          resFile = {
            state,
            country,
            carrier,
            valid,
            grupo: carrierEncontrado[0].grupo,
            linea: carrierEncontrado[0].linea,
          };
        } else {
          valid = false;
           con.query(
             "INSERT INTO document (name, country, state, carrier, valid) VALUES (?,?,?,?,?)",
             [
               file.name,
               country,
               state,
               carrier,
               valid
             ],
             (error, results) => {
               if (error) throw error;
               if (results[0]) {
               }
             }
           );
          resFile = {
            state,
            country,
            carrier,
            valid
          };
        }
        resFiles.push(resFile);
        if(i == files.length - 1) {
          resolve(resFiles);
        }
        i++;
      });
    });
  }).then((resFiles)=>{
    return res.status(200).json({status: 'ok', resFiles});
  });
};

module.exports = {
  validatorController,
};
