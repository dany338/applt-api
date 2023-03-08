const express = require('express');
const passport = require('passport');
const { jsPDF } = require("jspdf");

const CompaniesService = require('../services/companies.service');
const AuthService = require('../services/auth.service');
const AwsService = require('../services/aws.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createSchema, updateSchema, getSchema, querySchema, exportedSendEmailSchema } = require('../schemas/company.schema');

const router      = express.Router();
const service     = new CompaniesService();
const authService = new AuthService();
const awsService  = new AwsService();

router.post('/exported',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(exportedSendEmailSchema, 'body'),
  async (req, res, next) => {
    try {
      const { userId, email, from } = req.body;
      console.log('🚀 ~ file: company.router.js:23 ~ userId:', userId, email, from)
      const companies = await service.findByUser(userId);

      const createHeaders = (keys) => {
        var result = [];
        for (var i = 0; i < keys.length; i += 1) {
          result.push({
            id: keys[i],
            name: keys[i],
            prompt: keys[i],
            // width: 100,
            align: "center",
            padding: 0
          });
        }
        return result;
      };

      // PDF
      const headers = createHeaders([
        'id',
        'nit',
        'name',
        'address',
        'phone',
      ]);

      const newCompanies = companies.map(item => ({
        id: item.id,
        nit: item.nit,
        name: item.name,
        address: item.address,
        phone: item.phone,
      }));

      const doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait", unit: "pt", format: "letter" });
      doc.table(1, 1, newCompanies, headers, { autoSize: true });
      const file = doc.output('datauristring');
      const fileBase64 = file.substring(file.indexOf(',') + 1);

      console.log('🚀 ~ file: company.router.js:24 ~ file:', file, 'fileBase64:', fileBase64, 'newCompanies:', newCompanies, 'headers:', headers, 'companies:', companies)
      let rta = null;
      if (from == 'gmail') {
        rta = authService.sendPdfExported(userId, email, file);
      } else if (from == 'aws') {
        rta = awsService.sendPdfExported(userId, email, file);
      }
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  validatorHandler(querySchema, 'query'),
  async (req, res, next) => {
    try {
      const companies = await service.find(req.query);
      res.json(companies);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const company = await service.findOne(id);
      res.json(company);
    } catch (error) {
      next(error);
    }
  }
);

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const company = await service.create(body);
      res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getSchema, 'params'),
  validatorHandler(updateSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const company = await service.update(id, body);
      res.json(company);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(201).json({id});
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
