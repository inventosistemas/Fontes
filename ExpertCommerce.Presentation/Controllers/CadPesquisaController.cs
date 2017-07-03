using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Expert.Presentation.Controllers
{
    /*todas controllers são para fins específicos de controle de templates angular - qualquer alteração pode afetar na camada de $call - não inclusa código*/
    public class CadPesquisaController : Controller
    {
        
        // GET: CadPesquisa
      
        public ActionResult Index()
        {
            return View();
        }

        //Tela De Cadastro
        public ActionResult Passoe1()
        {
            return View();
        }

        //Tela De endereço
        public ActionResult Passoe2()
        {
            return View();
        }
        //Tela Editor
        public ActionResult Passoe3()
        {
            return View();
        }
        //tela busca
        public ActionResult Passoe4()
        {
            return View();
        }
        //FIM
        public ActionResult Passoe5()
        {
            return View();
        }
        //ORIGEM CLIENTE
        public ActionResult Passoe6()
        {
            return View();
        }
        //login
        public ActionResult Passoe7()
        {
            return View();
        }

    }
}