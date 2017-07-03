using System.Web;
using System.Web.Optimization;

namespace Expert.Presentation
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            /*static bundles*/

            #region jquery core and plugins
            bundles.Add(new ScriptBundle("~/Scripts/jq")
                .Include("~/Scripts/jquery/jquery-2.1.4.min.js")
                
                .Include("~/Scripts/plugins/scrollmagic.js")
               
                .Include("~/Scripts/jquery/jquery.mask.js")

               .Include("~/Scripts/novoSite/bs_leftnavi.js")
               .Include("~/Scripts/novoSite/itemslide.min.js")
              //.Include("~/Scripts/novoSite/sliding.js")
               .Include("~/Scripts/novoSite/bootstrap.min.js")
               .Include("~/Scripts/novoSite/owl.carousel.js")
            

                );
            #endregion



            #region core stylesheet
            bundles.Add(new StyleBundle("~/Styles/expcore")
               
                .Include("~/Styles/core.css")
                .Include("~/Styles/angular/ngDialog/ngDialog.css")
                 .Include("~/Styles/angular/ngDialog/ngDialog-theme-plain.css")
               
              
                .Include("~/Styles/novoSite/owl.carousel.css")
                .Include("~/Styles/novoSite/owl.theme.default.min.css")
               
                .Include("~/Styles/novoSite/bs_leftnavi.css")
                .Include("~/Styles/novoSite/bootstrap.min.css")
                 
                .Include("~/Styles/novoSite/stiloSite.css")

             
                

                );
            #endregion

            #region angular
            bundles.Add(new ScriptBundle("~/Scripts/ng").Include("~/Scripts/angular/angular.js",
                                                                "~/Scripts/angular/angular-ui-router.js",
                                                                "~/Scripts/angular/angular-animate.js",
                                                                "~/Scripts/angular/angular-cookies.js",
                                                                "~/Scripts/angular/ng-infinite-scroll.js",
                                                                "~/Scripts/angular/ngDialog.js")
                                                        .Include("~/Scripts/appconfig.js")
                                                        .IncludeDirectory("~/Scripts/controllers", "*.js")
                                                        .IncludeDirectory("~/Scripts/services", "*.js")
                                                        .Include("~/Scripts/appexpert.js"));
            #endregion

            #region compatibility tools
            bundles.Add(new ScriptBundle("~/scripts/compatibility")
                //.Include("~/Scripts/compatibility/modernizr-*")
                                                                  // .Include("~/Scripts/compatibility/respond.js")
                                                                   );
            #endregion

            #region main framework
            //bundles.Add(new ScriptBundle("~/scripts/fdt").IncludeDirectory("~/Scripts/foundation/", "*.js"));
           // bundles.Add(new StyleBundle("~/styles/fdt").IncludeDirectory("~/Styles/foundation/", "*.css"));
            #endregion

            #region fonts bundling
            bundles.Add(new StyleBundle("~/styles/expfonts").Include("~/Styles/fonts/fonts.css"));
            //bundles.Add(new StyleBundle("~/styles/expfontsie").Include("~/Styles/fontsie.css"));
            #endregion

            BundleTable.EnableOptimizations = true;
        }
    }
}
