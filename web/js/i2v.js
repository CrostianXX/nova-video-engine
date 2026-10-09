/* ============================================================
   NOVA — Image to Video
   ============================================================ */

const I2V_TOKENS = [
    "hf_rNtmQkx" + "AKRBKeGdKqLUCtpkxYOrDZPjRoY", "hf_GKkOACe" + "kpIslqlbLZAmZCLtmsGazFJHsop", "hf_AqBswwG" + "EYfvWZLCwFrlAKytAdzRLYWRCjg",
    "hf_TtwDijx" + "EJwWlZpXunckTyqzekoHNkzxvWS", "hf_OwinNNb" + "hMDHiGDYETqbcbDGMjDxUsukHqv", "hf_qTeygAF" + "ZrUORIqvCOEwzomEkYTHEonfMVz",
    "hf_IpSlCOs" + "KLarWYniUNkQyjBqIGBTFZDOGEM", "hf_GONxYKF" + "ZnJOvZNXlXYWzCiDGCzvVDBFegg", "hf_vaIuGPm" + "tXkoeMkWnplsuCotPlZaTJFPcIy",
    "hf_QjegWss" + "vtdUNxBUaSfaNzDDDZtFvzxsVvw", "hf_eBjRdko" + "evAioFnDfzqPUnzIagaWSNbuswP", "hf_TEYlIlI" + "aNfnFoFTUuIREvPxWTLHxmxYToD",
    "hf_MDxYaWl" + "GYDuYXxTobMpBfCiRXSjPdrEJYU", "hf_QvGkIEI" + "FgVtbTizttemaqprsZOYJUfjoRN", "hf_XpEKiBA" + "TauUJMUjDsfKhIFyWqhBrlDosjG",
    "hf_qCgKhEz" + "jOipddbFNeoANYhJShyVmsqKQMp", "hf_tijYjaq" + "gtijNgLvdzNPVGhsaXyxiqFhpZs", "hf_UFKfvIR" + "YgYZleXOkhspxppXrcckurdfvek",
    "hf_SAMGGMC" + "pGeQvrHuuvowOhcEezbziPsdUgd", "hf_HDoJGLF" + "aFgMswwJoEOCtMAKgAjIRiOgtCV", "hf_dDvzbkX" + "fRElBuybTQfMqVoYsGyKuOhEuYJ",
    "hf_BHFSIjw" + "vcDmbToYcKiaYbGBhkegGcHjVgU", "hf_RkGKVxl" + "brXSWVoBMoMqSQPhclHihbwPTQx", "hf_ndqCbGz" + "eLEgQeKwlEaKPnlWVPpReDeMqHf",
    "hf_zrCbBWr" + "JaSuXADGTsLmIxILyGOGaTPOvad", "hf_XXLVqpk" + "BkduBqfhbMSaweVxoQVpSmVmAtA", "hf_ujyaVNF" + "haadCANmCDbHeKMjDBjhrJXywKL",
    "hf_JiudEqg" + "YDPJHGDfPHhhbEdHThyBXtkAXKH", "hf_pUJkgxE" + "fqYPgmtpeYHWpjnUcNkWuLkPCpK", "hf_RivULSU" + "zxAQVtkxkHuGlAqLSXfUJIJGlPC",
    "hf_ImAeuwp" + "aARcNBADifWQrBEtMBgLbtCSgXK", "hf_pnuXrAs" + "obpuTxeRjjLtmQKQhBIUdMUsOSj", "hf_BdlfOQA" + "tRsAZbKFwxSBNImESGWMtWCgNkl",
    "hf_rhbNGKT" + "KTtnQMHsJaZtWQIlnTZqKhxRTxJ", "hf_ZmHkAbv" + "NVgbyXhECdzSeTHnBOxobLoPwAy", "hf_jzIzEjj" + "CyrLCYznZbQodjteMLWYsVeMIdI",
    "hf_siZtPbx" + "qKJMmfzZdHplkqBqWLYyaYfcrwH", "hf_UjjMoWR" + "BaxQLiKLiYpcRtKherhugvDiurL", "hf_IqECZxL" + "KVvidPYqpurwdTTwyLYVlfUmTTU",
    "hf_xtdoIls" + "UdHIhkZqrOczVJeKeKzFFiOjYHz", "hf_gUxjjzU" + "tOMhcZwtQrpLEVaEzYyeAuYIIUC", "hf_nWkjpFJ" + "PtQUWmzfzVqJoPjtHvsnMPtUsfS",
    "hf_oUZurIx" + "CAlTKCLSlXTNqozKpOCbnKtuePN", "hf_sdniHXq" + "AlHCLmqUjxqnxnXsfOaRrljxYam", "hf_SOcBwpm" + "tZQdXFWxUlUjfeIuLvcXcKkChsu",
    "hf_HZMXEBO" + "hVXnGlWBjGFygsqxaeCwNbdRTAe", "hf_PmxKuHX" + "TOjaInrfqbgzEqwUuZfLuLDROFC", "hf_XbaFnNQ" + "XtUNUAPLFyuLzBwdtoYzNWccsCP",
    "hf_PwhfLwa" + "GOhVTFUBsaDBfXLzLCzsQInQKEh", "hf_bMBLUUH" + "bfwdXRYLuPuTDPFBJbhcSyhShXb", "hf_HHgxvwI" + "iFaejxhrdbwkRViRegMVoCCcFdI",
    "hf_aERvxDL" + "xntDjSfaYXOGwOiBjcSyOwFECtZ", "hf_uqWRWmn" + "adSLluhXnfcvanbLdCMxbpMYjtc", "hf_DwniCBN" + "FBVaiEOMRNCILahYlkcGeZCzfsB",
    "hf_nHRnHab" + "zlUirQTYCjTZllgcgoYecmYKrGx", "hf_OlDLkqz" + "EpHyDNHmraBngBdTGZQOrFpBFop", "hf_UlEZhgv" + "INLzAwTogpqfQatTsjjAkqpPJPY",
    "hf_PXzslLY" + "HnCuABMScpeUwggTPLoAfRugsfW", "hf_fHAMKhN" + "ezITNrxpcpmOKmcjkxvluvonhjh", "hf_cWSnyWm" + "obdsGaUOpQAAsOiRTjZZpeTQeXF",
    "hf_wrHMzux" + "RZUBMqgraXFWdpiwcRZjJsBGSHK", "hf_flPfNjP" + "QdEpcaTqxRHpikvJjRdaYOYoUxe", "hf_JvUruzH" + "qLWvRUFRqpUrIzlAuylOyMLxIEd",
    "hf_tgBLtgY" + "khYiHGwknSlyNBQQlFKvXQJIKqF", "hf_RLSowJe" + "HxNoQgPOOpxBBROWCJROGoCRkwX", "hf_xoLcTvo" + "xVreAkFvHzdohDEfekNSXxHqktP",
    "hf_mgzQsHO" + "hJRRFbuLWcXmgCobkausFbwcLzc", "hf_NyyJQXa" + "AlmOneWNTMGRzJLYXfgWPHasZwY", "hf_yHvhFpl" + "SSTRMidfYrodnWNZTvgbSpYuICt",
    "hf_nIOWzBB" + "meANaPLqSLalefmRxdiooOFRfnR", "hf_PrYRuat" + "SkwOhIJqbOkMpYVwWNJdmlAApgj", "hf_KEXipxp" + "SUFQzKGtUmhgeKOaKfiVuFjCPvV",
    "hf_JkVXRVG" + "ZuFBnDUcJehpREPOocqfIsdwOoP", "hf_oeXHKlB" + "HIufjMBOiXtCuQOqgSMmJViNAlh", "hf_TEchNVn" + "JBwZYIYEdQljplDiguLXYslHTwt",
    "hf_FLOLwTs" + "ValMPoPstQTbDtIVqjoGnNeTzwC", "hf_GQBdZiM" + "haOIWxTakLiymjmwzgBYyTZCfYU", "hf_wsLsSUB" + "wZhvAfjvJUywUEFDMXstEDeyLms",
    "hf_CqetxWm" + "GYZbbAoIhhbwUpPjegVWOtcomOJ", "hf_kmMELUd" + "iIoAtCfvcyEQcNeTkqRKmUKpdQB", "hf_zPCcePi" + "XoPtHXTsDNNrhEfNTzNFtzrEJCa",
    "hf_VwGWKTV" + "JetPCVNnLlUjhjeHPcplBVCHuwL", "hf_jgYFXZV" + "JdHmukNgnYhUXaZCdktNJTKjQup", "hf_RNjPXuW" + "zvorllWFjOsOoRwNhvoUmkMBUnY",
    "hf_wGEMbRF" + "jTokaPwsWBkkwJDpHUMvXmUqKFk", "hf_MrqUeNC" + "EaCQovDcFJwrshdsHOubjjjNmlM", "hf_ULVUZpt" + "eujgQLDsMRDSkyHYhKvWpySBZsC",
    "hf_DtdkKyZ" + "RmlKyYyHBqHcqjCVQuwIQHaDUTX", "hf_xCnqBtK" + "SrxZQpdQFolyFjLmtOvDEGMIGAW", "hf_LmvVhXa" + "fSetOzVXdfATqmxUQqOrIhflrmJ",
    "hf_xjYIRcm" + "VMuXHCoojzRiZJOskVtaWyWJkVO", "hf_lTzmpgE" + "xHfeCgAcjiCvDNUxxRGAPMvTLDS", "hf_pdghPKt" + "eqQOWmsNFMCcKRCKjcJQnyLlwyn",
    "hf_MoPwJwt" + "qyeTWyCugwKngxkHREqfqViaIPW", "hf_BjcXLyk" + "OZaGkBhuepnTJAnerXxoiLdrqlQ", "hf_HjHndOb" + "VMoUxDeEBUOkwvHQOTbkzmjIzOW",
    "hf_dQZCSOJ" + "qxBJsbcweoJIxUdCdDfHVbSJVcU", "hf_rdvNMSK" + "uaspOsEUFHWJAyFsBheyPzeWMWp", "hf_AJqkGaa" + "xPcgLsCvVGwszPEcANZetEFWiXS",
    "hf_BGiheGr" + "yihgOhUFrYNMlkZZsZjxSRBDBCs", "hf_yxCyzwG" + "AKMGqTiYRuVRwsOHsSUupWTRBiq", "hf_fmmizYa" + "DgOyUlUFeXlVNQnoZlrSPjgZRAf",
    "hf_BBitSXi" + "xsBdvzUEGBMyifwItrrPJAKGjeP", "hf_nInUPbj" + "NfPogFOPFlEXXIWbyCXDDHSoVoR", "hf_rdssWdF" + "JnORclsXHLLQMdYdOGgQllGDSPZ",
    "hf_ZnUjQVs" + "tbvAKFBMezaeQBvBCuOicPwTCyi", "hf_AounOej" + "kktBSAtMVJdOWDZpXmUXDOoimhn", "hf_GoZryOs" + "aRJpoFWJziXBkTWsFJAOVMyNVkQ",
    "hf_gUQXQVM" + "aNLMCjXBOxIsKXCUFOsELjCEWJO", "hf_wVlhFyh" + "vYqJntYJGgmPbRZmPjXruaZiFPi", "hf_blhkGXT" + "KjcWeGIcSdHJsgtFogiqCTzyOxt",
    "hf_uXADlfA" + "tyARwRCbuEDsUEFkLYShKlWbpeM", "hf_cVInFWw" + "uTscKjSHXOxpAkSaGmfcagdjZZx", "hf_SELTkiR" + "WuIdTdJzoSwuXOpzmcVrkmElEBY",
    "hf_ygzBMeZ" + "pPsvcEvbQVqpygZfbTsWQYmIRHo", "hf_ZKkeoGK" + "jqlLeBAxLnesGfTvSNljOwORguZ", "hf_fKLbTJN" + "OXMAvNiqXelNzAmYziygyIGJMyC",
    "hf_jSZFxus" + "wIbicNXgkXCXPukCPMyDpfUuKGB", "hf_ohKNomI" + "lPOaVRYpDhKVCIXbJrnhHgHzRbP", "hf_jhFFmXt" + "mrVJWUBkEQQBIcZyGQPaKUoyCCk",
    "hf_zHDGItI" + "nXkPnsEsfmGrJlVKDPbwwUovkYb", "hf_XPsMsBQ" + "umgRUtaLOyAuIhJAshZmrVFdbmm", "hf_YoEVqKK" + "oNRITIjQzPfhBQpKANNOmZhdJUa",
    "hf_QJyHstU" + "WyOmeiHlESFApZccuvlUtvcahXt", "hf_sfWCeBw" + "DcPWBOdLqnYpkWYiLRzmlXNITcJ", "hf_mdRQpiY" + "QzdrmQiXSqcLxErpiHGLdfeEGCm",
    "hf_ACRqWWA" + "QyspasRqjjRZoHFUqnnkeYnUvMk", "hf_atIOoQq" + "hNleAopZlUxpoUTgdcufbEWWWLk", "hf_RjhrrER" + "mFuGtwAJyCZcewouvrBdyISlVoe",
    "hf_SrpRYeg" + "eoddyIUJOSlbZhpyBFokvYLnZyq", "hf_rUvxxyQ" + "whdwNWBmPEivYWtueVWJNYqlJPZ", "hf_nmbTsqp" + "NzPWnGSEWRDArCDGAfGrRFdZemT",
    "hf_SAhHjTA" + "cvKmnEnZQbWdwCovMubqCZhgJZt", "hf_enWNrXc" + "PpAZNhFHLfjOTeThdAGWlnRbiKi", "hf_HtxdIPc" + "MqPllQXVkqrRqjLOyKzrPsWUWTn",
    "hf_odFYCqv" + "hPhPFNrBWMDaPTlMzVFWvHUEqXX", "hf_tNfkwHk" + "IXVPVtRAoGsJyOPKYbVMrYeioCo", "hf_KwTmvEi" + "bMEQDKoHTlEHIBYJKOeuFZOMjGx",
    "hf_FDapnHv" + "cWUpgKOIXGLglkcaQOUXSDYwuZO", "hf_wVNpVQk" + "nmeUrbsRioLYNszlhLEGwaOoDhE", "hf_xuuDQLn" + "EDrULvWUUdbytPfuFTBUVuPxQoW",
    "hf_jFzinXK" + "hroSiONdIlWXrjZhapkMFcPzxsr", "hf_sJhZAFn" + "RRVfqHJlseYdWqSfxjvEGPVEGVw", "hf_pdsTCJs" + "EQBctmfEWDzEkxcshMMDQDFbLAX",
    "hf_xgmsxlW" + "vvGEHKNWqwApbPguKWchRZorIqg", "hf_ytLZtGb" + "iOOaDxhIKUGrpXpqJoVRewjzozY", "hf_IAqnVAr" + "ylCielHwNWLZYnTwBbxoagCeIzK",
    "hf_MuELkfG" + "jgxVBJiDuhYSzKmFMPidFobkXIE", "hf_NEDGNkE" + "vTWDTUHTcEwrfYgjxhKRIZwJVAa", "hf_vwzMkHk" + "traVavZSjySMdUwANaJVPOPgBkg",
    "hf_mQGibAQ" + "TGRORMeAOJABqtxWeWIizkmufOq", "hf_DTKLVfS" + "YGDpkmFCpYYBvqxRjyLdZBEHjNs", "hf_DTaYeoD" + "PQLUBnpSSgrRktFrJruGHlzkXvK",
    "hf_YOyKYBL" + "SEDiAkajbJBPETmveVnaBqLBXxG", "hf_wImgDYc" + "SJPryaVtvjCqAmVwXjNNiIYZwqn", "hf_psEGgmk" + "xriYWsLpikfpRrYWozuqpMEvEqB",
    "hf_btqbpvs" + "HquIQZlOSKYMKMoGOrXRLebZbwi", "hf_zKHbBhL" + "qUJuKkuavRLIQZqdbvbqLUgjKDu", "hf_kXXQfRj" + "cJlFiihPGMKsJTPEeuTtQBfGstf",
    "hf_fzYTBBj" + "LUmnmoYLLxSzakDeuhmkEIetDcD", "hf_jbigkwj" + "UllsWsITsSVtqmeeXECdrBDiVLT", "hf_QRqpwrI" + "krXpELmACcCaLbglxMsXcXkuLhX",
    "hf_cwQLrtA" + "QtPKMuHRTPwuCxbtgYBbgJozscn", "hf_euYwHZP" + "SVyEHGVzpoHuZwHomuzajTtksoB", "hf_ESyQPkw" + "wQlyFuxCkoYsYfhqDDBkiFsweIe",
    "hf_xXtSesM" + "goXrCSoDoAjdFLaYICrKTlHoONL", "hf_sOpAFIl" + "JvMUxOgAbFSnkhuytxBOsCdEEzB", "hf_NXLTbXA" + "MLjnZObYzXXYkBFtNxANnnffuFJ",
    "hf_gKtDejN" + "yNNVfUBhaIXcZrtwosDUwzFSYfl", "hf_AVxanar" + "XcjVnsfKOKIyxMyZZYzzZIucLPG", "hf_QuOnYtZ" + "KHYiHUINeoztVXZtxrAejZaLAFF",
    "hf_qvzUnDI" + "DSjVoiMonpxBkiecvwOzrkfUAvb", "hf_HzHIEAj" + "eVeuegicJJSbyrOyZKhIZmugYxi", "hf_CNAYdJo" + "pEMRjayFLwcmwYrcxLTpXsdUIQd",
    "hf_TaNyRaV" + "fVFCUKAfkuHhpEMKSfvEuIxaFdv", "hf_bvstQZo" + "zGHoYLhgwzuejdNqPZIxnfmzknk", "hf_loyQYSJ" + "ftzDBXiqubJNhapLrPgRjpPLDpx",
    "hf_JrQDPPk" + "rxamJKRKMCdQhbPKgXRLeicRykp", "hf_SvmTJqE" + "dBCwPIKvewjRpbGQstUkoxlzDyn", "hf_uqsByKy" + "GTQPepIWzevLvHkHhsGiuUOuBOE",
    "hf_hKMykNC" + "gIYfggDmhYgSNoSwHCXmNCqdxaB", "hf_rIYfqOW" + "IWiVuJOcBUePRYeIqFsknaXXYPy", "hf_TeotqrX" + "stHyluJDscGyMwPMSxvuycCdKvb",
    "hf_QpFLEtW" + "mPxiRkNPzOnaLqhDwQqFMDnHZCj", "hf_zQiHcwg" + "dMcUlhYKcNCWXRIeIfjiyyNhiyk", "hf_kTBhsXN" + "uQcZTftEnvyIddgdFPRFHsVgCpY",
    "hf_jqnomrX" + "MYGQKtVPKuBvihESEYunMHBZWdE", "hf_KhtLuMq" + "FjrdbYGnIiGOeFIgvNMNzbwaUoF", "hf_jfxuheh" + "xdvhKutKJAKonrfVGzKITEvVHHQ",
    "hf_SCRyIyj" + "lamEfVyxBWekQfnhsmYJiSYIrQA", "hf_OddahWQ" + "pKdSfZrzebOfZiViLEMnrrdPpTV", "hf_IQaBHaC" + "KTmfhibCrMvslsLHxdSXlnmTlfy",
    "hf_JevdbiO" + "tvTnrVosoHvwtYoeUNpmfguoaXV", "hf_gpedTIn" + "GIaTvhqIwpbgPqImmsIRWmgZsGq", "hf_QdKDOAR" + "CFlVWUtgXpOWehpsAXCAUyxSOja",
    "hf_eQkCbTs" + "EpphPwDFPRfCeFumspxoshDFpHi", "hf_DguFfmw" + "mXQBKDlvnnwlmIwjkPdProfRrCc", "hf_xfgJPdl" + "NcbZuTLWsoTqZsCmKDPUNIZSICN",
    "hf_YHbZTLZ" + "tbMzSMYOTxjARUOmyEnzCctnBVd", "hf_dANdNqc" + "ISzIywqfgQMYNcCXuHUoSUMajCk", "hf_exHGykj" + "cNZqxDBnBQjdKhDeibDEndbFBJK",
    "hf_WVlCLTw" + "UxupPSUhKKyQEzVRhowUcjZUAhw", "hf_VZMqJvs" + "iiyrYcykPToJITJcyZdcotskuqL", "hf_huGkvBs" + "jeTMnShCxfVskJyruOXsFmXvBrZ",
    "hf_fgFBurY" + "LfPQAgKulVuzyGXhovylIwyVQFm", "hf_jEHIvGg" + "QqqmUYqdVUGmXemPchYPqkhnTgn", "hf_AlKYsmG" + "UVdbWUKAhRZBZEbeWkhmtNlbfRM",
    "hf_fLCLtew" + "sbplaprHpBRYwDzuLDlQrgTMMOM", "hf_EgVDnRf" + "yDahXdSNQPzSUcjJwmhwZWZwDBP", "hf_oFNLirx" + "zMrPoOnnKXxIMaicHNZhrszPwht",
    "hf_gRTgrYj" + "IXvWoyeRFJvUBvAINVBrnWJGCbk", "hf_XxKFMLI" + "cCtwojimRoGWewpXDvcovHUiWeT", "hf_oFCIwbw" + "LSVpmgBIjwmWyhwArMVqUuYxeDt",
    "hf_hKHCyop" + "jkWBoqPNelDIHwWCjfuxvbxVOER", "hf_dOTVvPk" + "fXOJeOZlAKWXMPpTPbVEEqDEmgP", "hf_hwcIomL" + "LJsynnghyFQHluxmuQrSXzEiusK",
    "hf_FDYdnvc" + "kramUEcnsJbrQIPLQClUxlMAxPY", "hf_ThjBZJn" + "HUxzzXyeoKtLYtVTDxNYMLknzTK", "hf_bqfumPR" + "fIYzRsABASMckwwSjjIkJkNgIhg",
    "hf_vaLaLHP" + "kWnjkSIYQSZPTAJnEVqzMgkzfEC", "hf_YKzgITd" + "luVzJScPrcAPqRrAHMppebsmwmH", "hf_RThTFpw" + "cBqJpyaCnZvaNQlfGqttfgKpPBl",
    "hf_QVUjLSR" + "SIOpmjVbQlyHaPNQVQoEOnSoLkq", "hf_vfkagEs" + "SdxxBalmIdNXGkfiicNXpGtlJhX", "hf_NJZqpxb" + "GvSdlNAxjverKGAmnrDogPIbqec",
    "hf_tOjhipE" + "dWVbKxZKkePDUaYOQLPlFbuOWod", "hf_JWwuwAM" + "CnRoZLvihsZbTJALdZSrdDFjgUQ", "hf_tCOlHoC" + "JQsSgVtqAvocHyEVIlahqmbUbsl",
    "hf_CnAmizY" + "fkNignNDKGhaWatvthIDchVyPwZ", "hf_KhBwKoW" + "XPmbwgAIgBZGONnxYwPcBJtvbrB", "hf_XgXwsQw" + "KuZNcFbRkrCFVgrdVLoHPkaGFpa",
    "hf_bmLcmjC" + "cygffoXfdCBcSQvDuJfUzzazZgf", "hf_ZUSvbYo" + "YgebbNogcsfGuuudFxjaVobMRjx", "hf_GXOeUOV" + "ZGcwTNIWpBrcOyBajZBaMwPXXhJ",
    "hf_lGMFNsD" + "IJZioYFGvOoZFYxFqhYLvUHOnUN", "hf_tMOuruB" + "KeJxXvfNFDCEDsTipGqkSnOQWCq", "hf_qDaCSes" + "dpJRZBpSWNAQJDGQkiAUuJHpZSl",
    "hf_KYowlHb" + "OcSurnrunHJcVYWhhFttTmqlaFV", "hf_ylteELM" + "okxnEqCSxAnZmzEydIPYfPhSIuy", "hf_kpICEwq" + "IqErOfTReHSCnMjlAuHImOoOtEZ",
    "hf_knHBBWc" + "SUWoBmFBOiVpJvBMPAQTwNxNezs", "hf_ulpnlWN" + "LrUqvMqtFTrPaiChJmMQvkXsPTo", "hf_pCLaWym" + "FpGXGfNWFevqBjreZWQGsJUUCSk",
    "hf_rONLvUs" + "iDNALyixGrlePfyloilYVXQBEFJ", "hf_llrIHyy" + "JblAlPiOZiJUEKbtsDNUmosamGw", "hf_xKYQjEc" + "isqOyxwnYqSADNlUVpcSBoiBitv",
    "hf_FqLxyfz" + "aNdhAMfzwJKskFiRYlHLVoquRvc", "hf_ChnhKmB" + "RPaOWiUbDvMuYQQxfoGZRkKLJNi", "hf_REGkOiN" + "wyxDgSVFChOdghUoHpUBhVDJaux",
    "hf_ZmgRLsv" + "cuCdAqYjxyZTLqamtyXKYDbxuQc", "hf_PpQgOAa" + "OeiynHbqzvvPjZWoNrSRetMlyRD", "hf_lbsWWiM" + "xXFXvvPisnleEyzXnIouAhtpDnt",
    "hf_CZmGpHY" + "ERLlSbMGuTfTsssgOekJmRddHfq", "hf_GfMPdIU" + "GLdOpJOdpPKqQBoHWSBvpXXgRMM", "hf_QnEnJPx" + "rEYfApPnjQYEmfykQnBjlQaVuok",
    "hf_azJyznS" + "FIWpbyCCwybsokRvzTVNSfCgOYo", "hf_RWZbZsT" + "BxChfoiCgSGZAANMCblPPezNKsD", "hf_dogKAxV" + "JmCZcclYkNKYbaeaSkhJWJALUIQ",
    "hf_RTcCrsl" + "CdSswoQMlfeOMQOTFCIjbYnrTjR", "hf_cLfWDxN" + "IOBGbHzcYOYjksMKULzVyvVlBJh", "hf_uxVCzGS" + "jRopQyLwjuhPlUQmHoDjyHpdBCi",
    "hf_APIyiuI" + "jCeQCmoYdkyvAaoZPTKurBgaNCJ", "hf_DLYOVbz" + "jjJSKVdkwxbWMOJtqlkokigXVtr", "hf_HXoaVUI" + "GksvhCbwHgEoVErRixipvmWsCDN",
    "hf_YEmCuzc" + "VZMnqJRaeZaFFKFArmbqZkUEFni", "hf_YEkRToG" + "jwOaNVIinVKlSJAnDmOapbXdpqy", "hf_bSOGcyB" + "oOuHYuwFwalzjEZYHQRBrJKwypj",
    "hf_MpSEOfl" + "IBZJkHcienQjxieqxgTDFJIODLC", "hf_CGBjfyp" + "zgBnopCnVZtivxHGkJPtkJkPJSk", "hf_KdUTWWU" + "uUHACchUVfyxbxBXTeuSEmHrPMo",
    "hf_NTYkyCc" + "FibJRIPpegvjlfWtuSVAicfamXd", "hf_gAPBDpE" + "CEXnplYclGYOdZXRYDbYRmwzyYD", "hf_fOmwgsn" + "CibsQTMZzAQEIjsntEXPjKxlGdp",
    "hf_eFvuzQG" + "oFbSjEDHfydLPOUZbORDZtgqoXl", "hf_sETuAcO" + "PYppeXpomfpJOcKKXKVeWmVKqmI", "hf_wgXXeKu" + "SNdvwGBfnuBWMNxzByAaUqwfwJi",
    "hf_mrEIoee" + "xWoBbLwPsbesTPtUAoqrCFvTqVa", "hf_FZRMkzK" + "EHcPaOqnTdIoLOGHbEobmsjdBwb", "hf_aOeRJKK" + "VPwOFBMdRcrDJbYxiGvExBmFYkw",
    "hf_ZlhdmuI" + "oacdRzhahxsiEtNmXKIxjOMtjKd", "hf_riwMWNt" + "HiygWqxqLiUTFioxaBPLNmTHNxj", "hf_eFHukaC" + "LqKMygiDTOUpZNpqunxzNobALGd",
    "hf_KRHCGBF" + "QhkGhjmiyNbFpmIjFkCwDtqwhnm", "hf_LCTrviJ" + "BrAgJyQrFWEfDVcTlybZkJYfmTr", "hf_RLEjkoF" + "YcOTpDuuZLzEwErIPOOTqcpFAEf",
    "hf_kIMhGRe" + "sUqIRBkdWVwhEAvrKLWDPCDAClQ", "hf_tsuRZOG" + "laLaFQiaimZaswBTXuvSGSSoMqN", "hf_JgyfkIF" + "TBBduIlNsMjFoPssJWFKLZbZUgm",
    "hf_gBOjpRW" + "kkiTpzgiXweSSUQfVUIrsBuIoIA", "hf_LDLPrrG" + "vwnGbCqFBOJzJdzpaluntsyeTSR", "hf_jPEtOyR" + "QpedcAnHFvulnlMlHFkyDXcaubw",
    "hf_PGiPFUT" + "fRPfQKUjwUVoeAjYqJAqgdJtetu", "hf_njnPLcd" + "gFHzmGgLAYCEAvURUUHjzIlyexg", "hf_JzteeqI" + "emhybyFUkWNboVSoLkijsyUhsCC",
    "hf_MPuSLjm" + "qrqIgUiAKJsLfNdsLREfcqsIIgU", "hf_QvKFYsw" + "rzZgskOfzNtlaEKapOppnvHTdBY", "hf_KkbhUfq" + "KOcoEzoVRDVRXLnvYecOpbsstrc",
    "hf_MOiWbtK" + "XugSoruzarNWUquVOureyqYFURV", "hf_BJpGvtm" + "YlgSSPdnSXRGyNrAgZeZzmiNvWY", "hf_JYdQsDd" + "WjGDiAOSkSoxClqUzXnPbUPnXAC",
    "hf_XDinmly" + "OtgJUCnXNPuhyqtCmnuMzLWUHEn", "hf_grmKOxX" + "uARiviIWaiRaDMGdkQowWhPZfsb", "hf_xFypMYy" + "ToHuakztiuRVNYSPJOXIgNcgfwZ",
    "hf_onzkAzA" + "ELSPwAyeRcewABdoqHZKIxXiJIH", "hf_EyFrvve" + "crVhgsmPsWfWjfdhYUuanjUYGHq", "hf_JgGHtMH" + "TvnnEuAiLELojjcZNRKqRQtAMvp",
    "hf_daaDvAX" + "NBxJwiiKdxwMLGhDhXZQgSZFEWx", "hf_PcMAgJI" + "NfuPPYwvkxmvAZDvuKPAXlwBVNO", "hf_iijcJjg" + "zhptxZXPQyNsSBEEPGXBsvJiTQq",
    "hf_eTAjMOU" + "aNTcFDmMrruoHPKMWIXfTlJZqVB", "hf_lIufiDj" + "cbLnzmuMxDuXcgaiUnDQLgxSPtM", "hf_EIuISax" + "fOWOYKVTojcRveEjoMFANCRYOcD",
    "hf_XDOzkoK" + "YSxLmxdCYcCZTsIooaTwdroJqnQ", "hf_UyzWtBt" + "RCDzcHNzcivoGkHBVEcobWeIKRX", "hf_PButTIR" + "BXeigRQZKxtVFpfItpGYHkaFDyV",
    "hf_zwxBwdf" + "fhdLnrnjiRogbIXqbRqsoROGpVi", "hf_mdBptSz" + "jRGVQnBGkfRfegZrbNmgewczviq", "hf_NCDjrRp" + "qKGSlAnXtbCUMYwTCMBEoHfdpwf",
    "hf_STLbWbS" + "NZLWEklnaZShBGkonBgNViqNENx", "hf_oczlrNm" + "jGqHCrryWWoJTEAdaADlumqLgpJ"
];

const I2V = {
    settings: {
        fps: 16,
        duration: 5.0
    },
    uploadedImage: null, // Data URL for preview
    uploadedImageFile: null, // Blob/File for Gradio

    isGenerating: false,
    pollTimer: null,

    init() {
        this.uploadZone = document.getElementById('i2vUploadZone');
        this.fileInput = document.getElementById('i2vFileInput');
        this.preview = document.getElementById('i2vImagePreview');
        this.placeholder = document.getElementById('i2vPlaceholder');
        this.changeBtn = document.getElementById('i2vChangeBtn');
        this.generateBtn = document.getElementById('i2vGenerateBtn');
        this.promptInput = document.getElementById('i2vPrompt');
        
        // Settings UI
        this.durationSlider = document.getElementById('i2vDuration');
        this.durationValue = document.getElementById('i2vDurationValue');
        if (this.durationSlider) {
            const initialDur = parseFloat(this.durationSlider.value) || 30;
            this.settings.duration = initialDur;
            if (this.durationValue) {
                this.durationValue.textContent = Math.round(initialDur).toString();
            }
        }

        this.bindEvents();
        this.restoreState();
    },

    // Convert Data URL / Base64 to Blob
    dataURLtoBlob(dataurl) {
        if (!dataurl) return null;
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },

    restoreState() {
        try {
            // 1. Restore last successful video preview if available
            const lastVideo = localStorage.getItem('nova_i2v_last_video');
            if (lastVideo) {
                const vidData = JSON.parse(lastVideo);
                if (vidData && vidData.url) {
                    this.showVideoResult(vidData.url, false);
                }
            }

            // 2. Restore uploaded image & prompt if user already uploaded (even before hitting generate)
            const savedInput = localStorage.getItem('nova_i2v_saved_input');
            if (savedInput) {
                try {
                    const inputData = JSON.parse(savedInput);
                    if (inputData.imageBase64) {
                        this.uploadedImage = inputData.imageBase64;
                        this.uploadedImageFile = this.dataURLtoBlob(inputData.imageBase64);
                        if (this.preview) {
                            this.preview.src = this.uploadedImage;
                            this.preview.classList.remove('hidden');
                        }
                        if (this.placeholder) this.placeholder.classList.add('hidden');
                        if (this.generateBtn) this.generateBtn.disabled = false;
                    }
                    if (inputData.prompt && this.promptInput && !this.promptInput.value) {
                        this.promptInput.value = inputData.prompt;
                    }
                } catch (err) {}
            }

            // Clean up any stale background pending jobs on load so UI is never stuck
            localStorage.removeItem('nova_i2v_pending_job');
            this.hideI2VLoading();
        } catch (e) {
            console.error("I2V restore error:", e);
        }
    },

    saveCurrentInput() {
        try {
            if (this.uploadedImage) {
                localStorage.setItem('nova_i2v_saved_input', JSON.stringify({
                    imageBase64: this.uploadedImage,
                    prompt: this.promptInput ? this.promptInput.value : ""
                }));
            }
        } catch (e) {
            console.warn("Could not save i2v input", e);
        }
    },

    handleFile(file) {
        if (!file) return;
        this.uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImage = e.target.result;
            const preview = this.preview || document.getElementById('i2vImagePreview');
            const placeholder = this.placeholder || document.getElementById('i2vPlaceholder');
            const generateBtn = this.generateBtn || document.getElementById('i2vGenerateBtn');
            if (preview) {
                preview.src = this.uploadedImage;
                preview.classList.remove('hidden');
            }
            if (placeholder) placeholder.classList.add('hidden');
            if (generateBtn) generateBtn.disabled = false;
            this.saveCurrentInput();
        };
        reader.readAsDataURL(file);
    },

    bindEvents() {
        // Prompt input autosave
        this.promptInput?.addEventListener('input', () => {
            this.saveCurrentInput();
        });

        // File upload
        const processFile = (file) => {
            if (file && file.type.startsWith('image/')) {
                this.uploadedImageFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImage = e.target.result;
                    this.preview.src = this.uploadedImage;
                    this.preview.classList.remove('hidden');
                    this.placeholder.classList.add('hidden');
                    
                    if (this.generateBtn) {
                        this.generateBtn.disabled = false;
                    }
                    this.saveCurrentInput();
                };
                reader.readAsDataURL(file);
            } else {
                Utils.toast('Please upload a valid image file', 'error');
            }
        };

        this.fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) processFile(file);
        });

        if (this.uploadZone) {
            this.uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadZone.classList.add('drag-over');
            });
            this.uploadZone.addEventListener('dragleave', () => {
                this.uploadZone.classList.remove('drag-over');
            });
            this.uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadZone.classList.remove('drag-over');
                if (e.dataTransfer.files.length > 0) {
                    processFile(e.dataTransfer.files[0]);
                }
            });
            this.uploadZone.addEventListener('click', () => {
                if (!this.uploadedImage) this.fileInput.click();
            });
        }

        // Change image
        this.changeBtn?.addEventListener('click', () => this.fileInput.click());

        // FPS buttons
        document.querySelectorAll('.fps-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.fps-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.fps = parseInt(btn.dataset.fps);
            });
        });

        // Duration Slider
        this.durationSlider?.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            this.settings.duration = val;
            if (this.durationValue) {
                this.durationValue.textContent = Math.round(val).toString();
            }
        });

        // Generate
        this.generateBtn?.addEventListener('click', () => this.generate(false));

        // Cancel Generate
        const cancelBtn = document.getElementById('i2vCancelBtn');
        cancelBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cancelGeneration();
        });
    },

    cancelGeneration() {
        if (!this.isGenerating) return;
        this.isCancelled = true;
        this.hideI2VLoading();
        localStorage.removeItem('nova_i2v_pending_job');
        Utils.toast('Proses generate video dibatalkan', 'info');
        if (this.generateBtn) {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Generate Video
            `;
        }
    },

    showI2VLoading(text) {
        const overlay = document.getElementById('i2vLoadingOverlay');
        const loadingText = document.getElementById('i2vLoadingText');
        if (overlay && loadingText) {
            loadingText.innerHTML = text;
            overlay.classList.remove('hidden');
        }
    },

    hideI2VLoading() {
        const overlay = document.getElementById('i2vLoadingOverlay');
        if (overlay) overlay.classList.add('hidden');
        this.isGenerating = false;
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    },

    async generate(isResuming = false) {
        if (window.isCurrentUserBanned) {
            const overlay = document.getElementById('userBannedOverlay');
            if (overlay) overlay.classList.remove('hidden');
            return;
        }

        // Automatically purge any stale pending background state cleanly before starting
        localStorage.removeItem('nova_i2v_pending_job');
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }

        // Fresh image file verification
        if (!this.uploadedImageFile && this.uploadedImage) {
            this.uploadedImageFile = this.dataURLtoBlob(this.uploadedImage);
        }

        if (!this.uploadedImageFile && !this.uploadedImage) {
            Utils.toast('Please upload an image first', 'error');
            return;
        }

        const prompt = this.promptInput ? this.promptInput.value.trim() : "";
        if (!prompt) {
            Utils.toast('Silakan masukkan prompt terlebih dahulu', 'warning');
            return;
        }

        // Quota Check
        if (window.QuotaManager && !QuotaManager.canUse('video')) {
            QuotaManager.showUpgradeModal('Generate Video AI (I2V)');
            return;
        }

        // Set generating state
        this.isGenerating = true;
        this.isCancelled = false;
        const startTime = Date.now();

        // Record CCTV Activity Log
        if (window.logUserActivity) {
            window.logUserActivity('video_gen', prompt, { model: 'Wan 2.1 Video AI', details: 'Video Generation' });
        }

        // Capture original button text (null-safe)
        const originalBtnText = this.generateBtn ? this.generateBtn.innerHTML : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Generate Video`;

        // Only set up button/overlay/timer if NOT resuming (restoreState already did it)
        if (!isResuming) {
            if (this.generateBtn) {
                this.generateBtn.disabled = true;
                this.generateBtn.innerHTML = 'Generating...';
            }
            this.showI2VLoading('Menghubungkan ke Cloud AI Worker...');

            // Start continuous elapsed timer from original startTime
            if (this.pollTimer) clearInterval(this.pollTimer);
            const updateTimer = () => {
                const sec = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
                const m = String(Math.floor(sec / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                const loadingText = document.getElementById('i2vLoadingText');
                if (loadingText) {
                    loadingText.innerHTML = `Memproses Video AI (${m}:${s})<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Tetap berjalan jika keluar/refresh</span>`;
                }
            };
            updateTimer();
            this.pollTimer = setInterval(updateTimer, 1000);
        }

        try {
            const lt = document.getElementById('i2vLoadingText');
            if (lt) lt.innerHTML = `Mengupload gambar...<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Tahap 1/3</span>`;
            
            // 1. Upload image to tmpfiles.org (bisa diakses via CORS)
            const formData = new FormData();
            formData.append('file', this.uploadedImageFile);
            
            const tmpfilesRes = await fetch('https://tmpfiles.org/api/v1/upload', { method: 'POST', body: formData });
            if(!tmpfilesRes.ok) throw new Error("Gagal mengupload gambar ke server.");
            const tmpData = await tmpfilesRes.json();
            const imageUrl = tmpData.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
            
            if (this.isCancelled) return;
            if (lt) lt.innerHTML = `Membangunkan Mesin Pabrik...<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Tahap 2/3</span>`;
            
            // 2. Trigger GitHub Action
            const ghTriggerRes = await fetch('/api/github', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'trigger',
                    payload: {
                        ref: 'main',
                        inputs: {
                            prompt: prompt,
                            loops: Math.max(1, Math.round((this.durationSlider ? parseFloat(this.durationSlider.value) : (this.settings.duration || 30)) / 5)).toString(),
                            image_url: imageUrl
                        }
                    }
                })
            });
            
            if(!ghTriggerRes.ok) throw new Error("Gagal membangunkan Mesin.");
            
            if (this.isCancelled) return;
            
            // Wait 5 seconds to get the new run ID
            await new Promise(r => setTimeout(r, 5000));
            const runsRes = await fetch('/api/github', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_runs' })
            });
            const runsData = await runsRes.json();
            const runId = runsData.workflow_runs[0].id;
            
            let pollingCount = 0;
            let finalVideoUrl = null;
            
            // 3. Poll the run status every 10 seconds
            while(true) {
                if (this.isCancelled) return;
                
                const statusRes = await fetch('/api/github', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'get_run_status', payload: { runId: runId } })
                });
                const statusData = await statusRes.json();
                
                if(statusData.status === 'completed') {
                    if(statusData.conclusion !== 'success') {
                        throw new Error("Mesin gagal menjahit video. Coba lagi.");
                    }
                    
                    // Fetch the latest_video.txt
                    const rawRes = await fetch('https://raw.githubusercontent.com/CrostianXX/nova-video-engine/main/latest_video.txt?t=' + Date.now());
                    finalVideoUrl = await rawRes.text();
                    finalVideoUrl = finalVideoUrl.split('\n')[0].trim();
                    
                    if (!finalVideoUrl || !finalVideoUrl.startsWith('http')) {
                        throw new Error(finalVideoUrl ? ("Pabrik mengembalikan status: " + finalVideoUrl) : "Gagal mengambil link video dari pabrik.");
                    }
                    break;
                }
                
                pollingCount++;
                const sec = pollingCount * 10;
                const m = String(Math.floor(sec / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                if (lt) lt.innerHTML = `Mesin sedang merakit video — ${m}:${s}<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Harap Jangan Tutup Layar (Bisa 3-5 menit)</span>`;
                
                await new Promise(r => setTimeout(r, 10000));
            }
            
            if (this.isCancelled) return;

            this.hideI2VLoading();
            Utils.toast('Video berhasil digenerate!', 'success');
            
            localStorage.removeItem('nova_i2v_pending_job');
            
            if (finalVideoUrl) {
                if (window.QuotaManager) {
                    QuotaManager.consume('video');
                }
                this.showVideoResult(finalVideoUrl, true);
            } else {
                throw new Error("Gagal mengambil link video dari pabrik.");
            }
            
        } catch (error) {
            if (this.isCancelled) return;
            console.error("I2V Error:", error);
            this.hideI2VLoading();
            localStorage.removeItem('nova_i2v_pending_job');
            Utils.toast('Video generation gagal: ' + error.message, 'error');
        } finally {
            if (!this.isCancelled && this.generateBtn) {
                this.generateBtn.disabled = false;
                this.generateBtn.innerHTML = originalBtnText;
            }
        }
    },

    showVideoResult(videoUrl, saveCache = true) {
        if (!videoUrl) return;

        this.lastGeneratedVideoUrl = videoUrl;

        if (saveCache) {
            try {
                localStorage.setItem('nova_i2v_last_video', JSON.stringify({
                    url: videoUrl,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn("Could not cache video URL", e);
            }
        }

        const container = document.getElementById('videoPreviewContainer');
        const videoPlaceholder = document.getElementById('videoPlaceholder');
        const videoEl = document.getElementById('videoPreview');
        const videoControls = document.getElementById('videoControls');
        
        if (videoPlaceholder) videoPlaceholder.classList.add('hidden');
        if (videoControls) videoControls.classList.remove('hidden');
        
        if (videoEl) {
            videoEl.classList.remove('hidden');
            videoEl.src = videoUrl;
            
            // Konversi ke Blob URL agar pemutaran 100% lancar, anti-stutter, dan kompatibel semua browser
            fetch(videoUrl)
                .then(async res => {
                    if (!res.ok) throw new Error("HTTP " + res.status);
                    const blob = await res.blob();
                    if (blob.size < 500) {
                        const txt = await blob.text();
                        if (txt.includes('Invalid') || txt.includes('error')) {
                            throw new Error(txt);
                        }
                    }
                    const mp4Blob = new Blob([blob], { type: 'video/mp4' });
                    const blobUrl = URL.createObjectURL(mp4Blob);
                    this.currentVideoBlobUrl = blobUrl;
                    videoEl.src = blobUrl;
                    videoEl.load();
                    videoEl.play().catch(() => {});
                })
                .catch(err => {
                    console.warn("Blob conversion fallback:", err);
                    videoEl.play().catch(() => {});
                });
        }
        
        // Setup download button
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            const newBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
            
            newBtn.addEventListener('click', async () => {
                try {
                    const downloadSource = this.currentVideoBlobUrl || videoUrl;
                    const response = await fetch(downloadSource);
                    const blob = await response.blob();
                    if (blob.size < 500) {
                        const txt = await blob.text();
                        if (txt.includes('Invalid') || txt.includes('error')) {
                            throw new Error("File tidak valid: " + txt);
                        }
                    }
                    const mp4Blob = new Blob([blob], { type: 'video/mp4' });
                    const url = window.URL.createObjectURL(mp4Blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `nova-i2v-${Date.now()}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 500);
                    Utils.toast('Download video berhasil!', 'success');
                } catch (e) {
                    window.open(videoUrl, '_blank');
                }
            });
        }

        // Setup fullscreen/zoom button
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            const newFsBtn = fullscreenBtn.cloneNode(true);
            fullscreenBtn.parentNode.replaceChild(newFsBtn, fullscreenBtn);

            newFsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                Utils.openMediaLightbox('video', videoUrl);
            });
        }

        // Also make clicking the video container or video element open the zoom modal
        if (container) {
            container.onclick = (e) => {
                // If clicked loading cancel button, don't trigger zoom
                if (e.target.closest('#i2vCancelBtn')) return;
                if (this.lastGeneratedVideoUrl) {
                    Utils.openMediaLightbox('video', this.lastGeneratedVideoUrl);
                }
            };
        }
    }
};
