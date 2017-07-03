using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Expert.Presentation.Controllers
{
    /*todas controllers são para fins específicos de controle de templates angular - qualquer alteração pode afetar na camada de $call - não inclusa código*/
    public class TemplateController : Controller
    {
        #region angular partial directives
        //usando as diretivas do angular ao invés das partials nativas do .net, possibilitando o uso do single-page

        public ActionResult WebApplication()
        {
            return View("~/Views/Shared/_Layout.cshtml");
        }

        public ActionResult OrientationLock()
        {
            return View("~/Views/Templates/OrientationLock.cshtml");
        }

        public ActionResult Exp()
        {
            return View("~/Views/Templates/Exp.cshtml");
        }

        public ActionResult Loader()
        {
            return View("~/Views/Templates/Loader.cshtml");
        }

        public ActionResult CarrinhoNovo()
        {
            return View("~/Views/Templates/carrinhonovo.cshtml");
        }
        public ActionResult CarrinhoPrincipal()
        {
            return View("~/Views/Templates/carrinhoprincipal.cshtml");
        }

        #region App
        public ActionResult App()
        {
            return View("~/Views/Templates/App/App.cshtml");
        }
        public ActionResult Menu()
        {
            return View("~/Views/Templates/App/Menu.cshtml");
        }
        public ActionResult MenuMobile()
        {
            return View("~/Views/Templates/App/MenuMobile.cshtml");
        }
        public ActionResult MenuLogin()
        {
            return View("~/Views/Templates/App/MenuLogin.cshtml");
        }
        public ActionResult Header()
        {
            return View("~/Views/Templates/App/Header.cshtml");
        }

        public ActionResult Footer()
        {
            return View("~/Views/Templates/App/Footer.cshtml");
        }
        #endregion
      
        #region Modals
        public ActionResult Modal()
        {
            return View("~/Views/Templates/Modals/Alltypes.cshtml");
        }
        #endregion

        #region Plugins
        public ActionResult Calendario()
        {
            return View("~/Views/Templates/Plugins/Calendario.cshtml");
        }
        #endregion
        #endregion
    }
}

