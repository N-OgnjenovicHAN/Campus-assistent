/* ==========================================================================
   HAN Studenten Hub - gedeeld script
   Gewoon vanilla JavaScript, geen framework of build-stap nodig.

   LET OP over "inloggen": dit is een statische site zonder server. De
   inlog-gate hieronder (authGuard/login) onthoudt alleen of iemand op
   "inloggen" heeft geklikt (via localStorage in de browser) - het is puur
   voor de uitstraling/flow en controleert geen echt wachtwoord. Voor een
   echte koppeling met HAN-accounts is een backend nodig.
   ========================================================================== */

var HAN_LOGIN_SLEUTEL = 'han_hub_ingelogd';

document.addEventListener('DOMContentLoaded', function () {
  initMobielMenu();
  initTabToggle('#activiteiten-filters', 'filterpil', '.event-item', 'data-categorie');
  initPlattegrond();
  initAbsentieForm();
  initLoginForm();
  initUitloggen();
});

/* ------------------------------ Inlog-gate --------------------------------- */
/* Wordt vroeg (voor de rest van de pagina rendert) aangeroepen via een klein
   inline scriptje in de <head> van elke beveiligde pagina:
     <script>if(!localStorage.getItem('han_hub_ingelogd')){location.replace('login.html');}</script>
   Zo voorkomen we dat de pagina heel even zichtbaar is voor iemand niet is
   "ingelogd". Deze functie hier regelt alleen het inlog-scherm zelf en
   uitloggen. */

function initLoginForm() {
  var form = document.getElementById('login-form');
  var status = document.getElementById('login-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (status) status.textContent = 'Bezig met inloggen...';
    setTimeout(function () {
      try {
        localStorage.setItem(HAN_LOGIN_SLEUTEL, '1');
      } catch (err) {
        /* privénavigatie o.i.d.: negeren, we sturen toch door */
      }
      window.location.href = 'main.html';
    }, 500);
  });
}

function initUitloggen() {
  var links = document.querySelectorAll('.uitlog-link');
  if (links.length === 0) return;
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      try {
        localStorage.removeItem(HAN_LOGIN_SLEUTEL);
      } catch (err) {
        /* negeren */
      }
      window.location.href = 'login.html';
    });
  });
}

/* ------------------------------ Mobiel menu ------------------------------- */

function initMobielMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.side-menu');
  var overlay = document.querySelector('.menu-overlay');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    if (overlay) overlay.classList.remove('verborgen');
  }
  function closeMenu() {
    menu.classList.remove('open');
    if (overlay) overlay.classList.add('verborgen');
  }

  toggle.addEventListener('click', function () {
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  if (overlay) overlay.addEventListener('click', closeMenu);
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
}

/* --------------------- Generieke tabs / filterpillen ----------------------- */
/* Gebruikt voor de categoriefilters op Activiteiten. Knoppen krijgen
   data-value="..." en de bijbehorende items krijgen het attribuut dat je
   meegeeft (bv. data-categorie). */

function initTabToggle(tabsSelector, knopClass, itemSelector, dataAttr) {
  var bar = document.querySelector(tabsSelector);
  if (!bar) return;
  var buttons = bar.querySelectorAll('.' + knopClass);
  var items = document.querySelectorAll(itemSelector);

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) {
        b.classList.remove('actief');
      });
      btn.classList.add('actief');

      var waarde = btn.getAttribute('data-value');
      items.forEach(function (item) {
        var toon = waarde === 'alles' || item.getAttribute(dataAttr) === waarde;
        item.classList.toggle('verborgen', !toon);
      });
    });
  });
}

/* ---------------------------------- Plattegrond ----------------------------------- */
/* Werkt als de laagselectie in Google Maps: elke laag-knop (data-laag) zet
   een groep tegels aan/uit. "Gebouwnamen" is een uitzondering: die schakelt
   geen tegels maar de kop-labels met de gebouwnaam. */

function initPlattegrond() {
  var gebouwKnoppen = document.querySelectorAll('.gebouw-knop');
  if (gebouwKnoppen.length === 0) return;

  // Gebouw wisselen
  gebouwKnoppen.forEach(function (btn) {
    btn.addEventListener('click', function () {
      gebouwKnoppen.forEach(function (b) {
        b.classList.remove('actief');
      });
      btn.classList.add('actief');
      var gebouw = btn.getAttribute('data-gebouw');
      document.querySelectorAll('.gebouw-paneel').forEach(function (paneel) {
        paneel.classList.toggle('verborgen', paneel.getAttribute('data-gebouw') !== gebouw);
      });
    });
  });

  // Verdieping wisselen (per gebouw-paneel apart, zodat verdieping "0" van
  // gebouw A niet de verdieping "0" van gebouw D beinvloedt)
  document.querySelectorAll('.gebouw-paneel').forEach(function (paneel) {
    var verdiepingKnoppen = paneel.querySelectorAll('.verdieping-knop');
    verdiepingKnoppen.forEach(function (btn) {
      btn.addEventListener('click', function () {
        verdiepingKnoppen.forEach(function (b) {
          b.classList.remove('actief');
        });
        btn.classList.add('actief');
        var verdieping = btn.getAttribute('data-verdieping');
        paneel.querySelectorAll('.verdieping-paneel').forEach(function (vp) {
          vp.classList.toggle('verborgen', vp.getAttribute('data-verdieping') !== verdieping);
        });
      });
    });
  });

  // Laag-knoppen (klaslokalen, studieruimtes, kantines, parkeren, bushalte)
  var laagKnoppen = document.querySelectorAll('.laag-optie[data-laag]');
  var vrijCheckbox = document.getElementById('alleen-vrij');
  var gebouwnamenKnop = document.querySelector('.laag-optie[data-laag-namen]');

  function pasFiltersToe() {
    var actieveLagen = [];
    laagKnoppen.forEach(function (btn) {
      if (btn.classList.contains('aan')) actieveLagen.push(btn.getAttribute('data-laag'));
    });
    var alleenVrij = vrijCheckbox && vrijCheckbox.checked;

    document.querySelectorAll('.ruimte-tegel').forEach(function (tegel) {
      var laag = tegel.getAttribute('data-laag');
      var status = tegel.getAttribute('data-status');
      var toon = actieveLagen.indexOf(laag) !== -1;
      if (toon && alleenVrij && laag === 'studieruimte' && status === 'bezet') toon = false;
      tegel.classList.toggle('verborgen', !toon);
    });
  }

  laagKnoppen.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var isAan = btn.classList.contains('aan');
      btn.classList.toggle('aan', !isAan);
      btn.classList.toggle('uit', isAan);
      pasFiltersToe();
    });
  });

  if (vrijCheckbox) vrijCheckbox.addEventListener('change', pasFiltersToe);

  if (gebouwnamenKnop) {
    gebouwnamenKnop.addEventListener('click', function () {
      var isAan = gebouwnamenKnop.classList.contains('aan');
      gebouwnamenKnop.classList.toggle('aan', !isAan);
      gebouwnamenKnop.classList.toggle('uit', isAan);
      document.querySelectorAll('.gebouw-naam-label').forEach(function (label) {
        label.classList.toggle('verborgen', isAan);
      });
    });
  }
}

/* ----------------------------- Afwezigheid melden ------------------------------- */

// Zelfde lesdata als het rooster - hiermee zoeken we automatisch op welke
// docent er les geeft op de datum/tijd die de student opgeeft, zoals
// gevraagd: "deze melding wordt gestuurd naar de docent waar je op dat
// moment les van krijgt".
var ROOSTER_DATA = [
  { dag: 'maandag', start: '09:00', eind: '10:30', vak: 'Softwarekwaliteit', docent: 'M. Jansen' },
  { dag: 'maandag', start: '11:00', eind: '12:30', vak: 'Softwarekwaliteit', docent: 'M. Jansen' },
  { dag: 'maandag', start: '13:30', eind: '15:30', vak: 'Databases', docent: 'S. de Vries' },
  { dag: 'dinsdag', start: '09:00', eind: '11:00', vak: 'Project Fullstack', docent: 'K. Bakker' },
  { dag: 'dinsdag', start: '13:00', eind: '14:30', vak: 'Statistiek', docent: 'L. Peters' },
  { dag: 'woensdag', start: '10:00', eind: '12:00', vak: 'Webontwikkeling', docent: 'T. Smit' },
  { dag: 'donderdag', start: '09:00', eind: '10:30', vak: 'Bedrijfskunde', docent: 'R. Willems' },
  { dag: 'donderdag', start: '11:00', eind: '13:00', vak: 'Project Fullstack', docent: 'K. Bakker' },
  { dag: 'vrijdag', start: '09:00', eind: '11:00', vak: 'Databases', docent: 'S. de Vries' }
];
var WEEKDAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];

function zoekLesOp(datumStr, tijdStr) {
  if (!datumStr || !tijdStr) return null;
  var datum = new Date(datumStr + 'T00:00:00');
  if (isNaN(datum.getTime())) return null;
  var dagNaam = WEEKDAGEN[datum.getDay()];
  var gevonden = null;
  ROOSTER_DATA.forEach(function (les) {
    if (gevonden) return;
    if (les.dag === dagNaam && tijdStr >= les.start && tijdStr < les.eind) {
      gevonden = les;
    }
  });
  return gevonden;
}

function initAbsentieForm() {
  var form = document.getElementById('absentie-form');
  if (!form) return;

  var formWrapper = document.getElementById('absentie-form-wrapper');
  var succesWrapper = document.getElementById('absentie-succes');
  var opnieuwBtn = document.getElementById('absentie-opnieuw');
  var redenSelect = document.getElementById('reden');
  var redenAndersVeld = document.getElementById('reden-anders-veld');
  var redenAndersInput = document.getElementById('reden-anders');
  var datumInput = document.getElementById('datum');
  var tijdInput = document.getElementById('tijd');
  var lesHint = document.getElementById('les-hint');
  var succesDocent = document.getElementById('succes-docent');
  var succesVak = document.getElementById('succes-vak');
  var succesVakWrap = document.getElementById('succes-vak-wrap');

  // "Anders" gekozen als reden -> los tekstveld tonen
  if (redenSelect && redenAndersVeld) {
    redenSelect.addEventListener('change', function () {
      var isAnders = redenSelect.value === 'Anders';
      redenAndersVeld.classList.toggle('verborgen', !isAnders);
      if (redenAndersInput) redenAndersInput.required = isAnders;
    });
  }

  // Live-hint: laat alvast zien welke docent de melding krijgt zodra
  // datum + tijd zijn ingevuld.
  function toonLesHint() {
    if (!lesHint) return;
    var les = zoekLesOp(datumInput ? datumInput.value : '', tijdInput ? tijdInput.value : '');
    if (les) {
      lesHint.textContent = 'Gaat naar ' + les.docent + ' (' + les.vak + ').';
      lesHint.classList.remove('verborgen');
    } else if (datumInput && datumInput.value && tijdInput && tijdInput.value) {
      lesHint.textContent = 'Geen les gevonden op dit moment — de melding gaat naar je studieadministratie.';
      lesHint.classList.remove('verborgen');
    } else {
      lesHint.classList.add('verborgen');
    }
  }
  if (datumInput) datumInput.addEventListener('change', toonLesHint);
  if (tijdInput) tijdInput.addEventListener('change', toonLesHint);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var les = zoekLesOp(datumInput ? datumInput.value : '', tijdInput ? tijdInput.value : '');
    if (succesDocent) succesDocent.textContent = les ? les.docent : 'je studieadministratie';
    if (succesVakWrap && succesVak) {
      if (les) {
        succesVak.textContent = les.vak;
        succesVakWrap.classList.remove('verborgen');
      } else {
        succesVakWrap.classList.add('verborgen');
      }
    }
    if (formWrapper) formWrapper.classList.add('verborgen');
    if (succesWrapper) succesWrapper.classList.remove('verborgen');
  });

  if (opnieuwBtn) {
    opnieuwBtn.addEventListener('click', function () {
      if (succesWrapper) succesWrapper.classList.add('verborgen');
      if (formWrapper) formWrapper.classList.remove('verborgen');
      form.reset();
      if (redenAndersVeld) redenAndersVeld.classList.add('verborgen');
      if (lesHint) lesHint.classList.add('verborgen');
    });
  }
}
