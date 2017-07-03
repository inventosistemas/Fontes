using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Expert.Presentation.Controllers
{
    /*todas controllers são para fins específicos de controle de templates angular - qualquer alteração pode afetar na camada de $call - não inclusa código*/
    public class CarrinhoController : Controller
    {
        // GET: Carrinho
        //public ActionResult Index() { return View(); }
        public ActionResult Index()
        {
            bool isMobile = Request.Browser.IsMobileDevice;
            return View(isMobile);
        }
        public ActionResult Produtos()
        {

            string datahoje = DateTime.Now.ToString("dd/MM/yyyy");
            return View((object)datahoje);
        }
        public ActionResult Pagamento() { return View(); }
        public ActionResult Conclusao() { return View(); }

        public ActionResult ReprocessaPagamento() { return View(); }
    }
}