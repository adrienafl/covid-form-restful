const generation = require('./generation');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use('/pdf', express.static('./certificate.pdf'));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server running on port "+PORT);

    app.get("/", async (req, res) => {
        var { lastname, firstname, birthday, lieunaissance, address, zipcode, town, datesortie, heuresortie, reason } = req.query;
        let profile = {
            lastname: lastname || '',
            firstname: firstname || '',
            birthday: birthday || '',
            lieunaissance: lieunaissance || '',
            address: address || '',
            zipcode: zipcode || '',
            town: town || '',
            datesortie: datesortie || '',
            heuresortie: heuresortie || ''
        };

        if (reason == '' || reason == undefined) {
            reason = 'sport_animaux'
        }

        if (reason == 'menu'){

            var reasons = [
              { name: 'Activité professionnelle ', href: req.originalUrl.replace('reason=menu','reason=travail')},
              { name: 'Achats', href: req.originalUrl.replace('reason=menu','reason=achats')},
              { name: 'Médical', href: req.originalUrl.replace('reason=menu','reason=sante')},
              { name: 'Motif familial impérieux ou garde d\'enfants', href: req.originalUrl.replace('reason=menu','reason=famille')},
              { name: 'Déplacement des personnes en handicap', href: req.originalUrl.replace('reason=menu','reason=handicap')},
              { name: 'Balade ou sport', href: req.originalUrl.replace('reason=menu','reason=sport_animaux')},
              { name: 'Convocation Judiciaire', href: req.originalUrl.replace('reason=menu','reason=convocation')},
              { name: 'Missions d\'intérêt général', href: req.originalUrl.replace('reason=menu','reason=missions')},
              { name: 'Enfants à l\'école ou activités périscolaires', href: req.originalUrl.replace('reason=menu','reason=enfants')}
            ];

            res.render('pages/menu', {
              reasons:reasons
            });
            res.end();
            return;
        }

        const pdfBlob = await generation.generatePdf(profile, reason);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attestation.pdf');
        res.write(Buffer.from(pdfBlob), 'binary');
        res.end();
    });

    app.post("/", async (req, res) => {
        var { lastname, firstname, birthday, lieunaissance, address, zipcode, town, datesortie, heuresortie, reason } = req.body;

        let profile = {
            lastname: lastname || '',
            firstname: firstname || '',
            birthday: birthday || '',
            lieunaissance: lieunaissance || '',
            address: address || '',
            zipcode: zipcode || '',
            town: town || '',
            datesortie: datesortie || '',
            heuresortie: heuresortie || ''
        };
        
        if (reason == '' || reason == undefined) {
            reason = 'sport_animaux'
        }

        if (reason == 'menu'){

            var reasons = [
              { name: 'Activité professionnelle ', href: req.originalUrl.replace('reason=menu','reason=travail')},
              { name: 'Achats', href: req.originalUrl.replace('reason=menu','reason=achats')},
              { name: 'Médical', href: req.originalUrl.replace('reason=menu','reason=sante')},
              { name: 'Motif familial impérieux ou garde d\'enfants', href: req.originalUrl.replace('reason=menu','reason=famille')},
              { name: 'Déplacement des personnes en handicap', href: req.originalUrl.replace('reason=menu','reason=handicap')},
              { name: 'Balade ou sport', href: req.originalUrl.replace('reason=menu','reason=sport_animaux')},
              { name: 'Convocation Judiciaire', href: req.originalUrl.replace('reason=menu','reason=convocation')},
              { name: 'Missions d\'intérêt général', href: req.originalUrl.replace('reason=menu','reason=missions')},
              { name: 'Enfants à l\'école ou activités périscolaires', href: req.originalUrl.replace('reason=menu','reason=enfants')}
            ];
            
            res.render('pages/menu', {
              reasons:reasons
            });
            res.end();
            return;
        }

        const pdfBlob = await generation.generatePdf(profile, reason);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=attestation.pdf');
        res.write(Buffer.from(pdfBlob), 'binary');
        res.end();
    });
});
