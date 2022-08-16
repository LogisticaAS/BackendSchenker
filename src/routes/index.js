const express = require("express");
const router = express.Router();
const path = require("path");
const { downloadXmlController } = require("../controllers/downloadXml");
const { indexController } = require("../controllers/index");
const { validatorController } = require("../controllers/validator");
const { xmlsController } = require("../controllers/xmls");

router.post("/index", indexController);
router.post("/excel", validatorController);
router.get("/getXmls", xmlsController);
router.post("/download", downloadXmlController);

module.exports = router;
