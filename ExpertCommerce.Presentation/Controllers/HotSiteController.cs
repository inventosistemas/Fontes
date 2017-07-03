﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Expert.Presentation.Controllers
{
    /*todas controllers são para fins específicos de controle de templates angular - qualquer alteração pode afetar na camada de $call - não inclusa código*/
    public class HotsiteController : Controller
    {
        // GET: HotSite

        public ActionResult Index()
        {
            bool isMobile = Request.Browser.IsMobileDevice;
            return View(isMobile);
        }
    }
}