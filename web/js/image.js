/* ============================================================
   NOVA — I2I Image Editing (Simplified with QWEN_EDIT_IMAGE)
   ============================================================ */

const I2I_TOKENS = [
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

const ImageEditor = {
    uploadedImageFile: null,
    uploadedImageBase64: null,

    isGenerating: false,
    pollTimer: null,

    init() {
        this.uploadZone = document.getElementById('imageUploadZone');
        this.fileInput = document.getElementById('imageFileInput');
        this.preview = document.getElementById('imagePreview');
        this.placeholder = document.getElementById('imagePlaceholder');
        this.changeImageBtn = document.getElementById('changeImageBtn');
        
        this.generateBtn = document.getElementById('imageGenerateBtn');
        this.loraSelect = document.getElementById('loraSelect');
        this.promptInput = document.getElementById('imagePrompt');
        
        this.downloadBtn = document.getElementById('downloadImageBtn');
        
        this.bindEvents();
        this.restoreState();
    },

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
            // 1. Restore last successful edited image preview if available
            const lastImg = localStorage.getItem('nova_i2i_last_image');
            if (lastImg) {
                const imgData = JSON.parse(lastImg);
                if (imgData && imgData.url) {
                    this.showResult(imgData.url, false);
                }
            }

            // 2. Restore uploaded image & prompt if user already uploaded (even before hitting generate)
            const savedInput = localStorage.getItem('nova_i2i_saved_input');
            if (savedInput) {
                try {
                    const inputData = JSON.parse(savedInput);
                    if (inputData.imageBase64) {
                        this.uploadedImageBase64 = inputData.imageBase64;
                        this.uploadedImageFile = this.dataURLtoBlob(inputData.imageBase64);
                        if (this.preview) {
                            this.preview.src = inputData.imageBase64;
                            this.preview.classList.remove('hidden');
                        }
                        if (this.placeholder) this.placeholder.classList.add('hidden');
                        if (this.changeImageBtn) this.changeImageBtn.classList.remove('hidden');
                    }
                    if (inputData.prompt && this.promptInput && !this.promptInput.value) {
                        this.promptInput.value = inputData.prompt;
                    }
                    if (inputData.lora && this.loraSelect) {
                        this.loraSelect.value = inputData.lora;
                    }
                } catch (err) {}
            }

            // Clean up any stale background pending jobs on load so UI is never stuck
            localStorage.removeItem('nova_i2i_pending_job');
            this.hideI2ILoading();
        } catch (e) {
            console.error("I2I restore error:", e);
        }
    },

    saveCurrentInput() {
        try {
            if (this.uploadedImageBase64) {
                localStorage.setItem('nova_i2i_saved_input', JSON.stringify({
                    imageBase64: this.uploadedImageBase64,
                    prompt: this.promptInput ? this.promptInput.value : "",
                    lora: this.loraSelect ? this.loraSelect.value : "KV-A"
                }));
            }
        } catch (e) {
            console.warn("Could not save i2i input", e);
        }
    },

    handleFile(file) {
        if (!file) return;
        this.uploadedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            this.uploadedImageBase64 = e.target.result;
            const preview = this.preview || document.getElementById('imagePreview');
            const placeholder = this.placeholder || document.getElementById('imagePlaceholder');
            const changeBtn = this.changeImageBtn || document.getElementById('changeImageBtn');
            if (preview) {
                preview.src = e.target.result;
                preview.classList.remove('hidden');
            }
            if (placeholder) placeholder.classList.add('hidden');
            if (changeBtn) changeBtn.classList.remove('hidden');
            this.saveCurrentInput();
        };
        reader.readAsDataURL(file);
    },

    bindEvents() {
        // Prompt & lora autosave
        this.promptInput?.addEventListener('input', () => this.saveCurrentInput());
        this.loraSelect?.addEventListener('change', () => this.saveCurrentInput());

        // File upload
        const processFile = Utils.handleFileUpload(
            this.fileInput, this.preview, this.placeholder,
            async (file, data) => { 
                this.uploadedImageFile = file; 
                this.uploadedImageBase64 = data;
                if(this.changeImageBtn) this.changeImageBtn.classList.remove('hidden');
                
                // Hide placeholder and show preview
                this.preview.classList.remove('hidden');
                this.placeholder.classList.add('hidden');
                this.saveCurrentInput();
            }
        );
        Utils.setupDragDrop(this.uploadZone, this.fileInput, processFile);

        // Change Image
        this.changeImageBtn?.addEventListener('click', () => {
            this.fileInput.click();
        });

        // Generate
        this.generateBtn?.addEventListener('click', () => this.generate(false));

        // Cancel Generate
        const cancelBtn = document.getElementById('i2iCancelBtn');
        cancelBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.cancelGeneration();
        });

        // Download
        this.downloadBtn?.addEventListener('click', () => {
            const finalImage = document.getElementById('finalResultImage');
            if(finalImage && finalImage.src) {
                const a = document.createElement('a');
                a.href = finalImage.src;
                a.download = `NOVA_I2I_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    },

    cancelGeneration() {
        if (!this.isGenerating) return;
        this.isCancelled = true;
        this.hideI2ILoading();
        localStorage.removeItem('nova_i2i_pending_job');
        Utils.toast('Proses edit gambar dibatalkan', 'info');
        if (this.generateBtn) {
            this.generateBtn.disabled = false;
            this.generateBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Edit Image
            `;
        }
    },

    showI2ILoading(text) {
        const overlay = document.getElementById('i2iLoadingOverlay');
        const loadingText = document.getElementById('i2iLoadingText');
        if (overlay && loadingText) {
            loadingText.innerHTML = text;
            overlay.classList.remove('hidden');
        }
    },

    hideI2ILoading() {
        const overlay = document.getElementById('i2iLoadingOverlay');
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
        localStorage.removeItem('nova_i2i_pending_job');
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }

        if (!this.uploadedImageFile && this.uploadedImageBase64) {
            this.uploadedImageFile = this.dataURLtoBlob(this.uploadedImageBase64);
        }

        if (!this.uploadedImageFile && !this.uploadedImageBase64) {
            Utils.toast('Please upload an image first', 'error');
            return;
        }

        const prompt = this.promptInput?.value?.trim() || '';
        if (!prompt) {
            Utils.toast('Please enter a prompt', 'warning');
            return;
        }

        // Quota Check
        if (window.QuotaManager && !QuotaManager.canUse('image')) {
            QuotaManager.showUpgradeModal('Generate & Edit Gambar AI (I2I)');
            return;
        }

        // Set generating state
        this.isGenerating = true;
        this.isCancelled = false;
        const lora = this.loraSelect ? this.loraSelect.value : "KV-A";
        const startTime = Date.now();

        // Record CCTV Activity Log
        if (window.logUserActivity) {
            window.logUserActivity('image_gen', prompt, { model: 'Qwen-Image AI', details: `LoRA: ${lora}` });
        }

        // Capture original button text (null-safe)
        const originalBtnText = this.generateBtn ? this.generateBtn.innerHTML : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> Edit Image`;

        // Only set up button/overlay/timer if NOT resuming (restoreState already did it)
        if (!isResuming) {
            if (this.generateBtn) {
                this.generateBtn.disabled = true;
                this.generateBtn.innerHTML = 'Generating...';
            }
            this.showI2ILoading('Menghubungkan ke Cloud AI Worker...');

            // Start continuous elapsed timer from initial startTime
            if (this.pollTimer) clearInterval(this.pollTimer);
            const updateTimer = () => {
                const sec = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
                const m = String(Math.floor(sec / 60)).padStart(2, '0');
                const s = String(sec % 60).padStart(2, '0');
                const loadingText = document.getElementById('i2iLoadingText');
                if (loadingText) {
                    loadingText.innerHTML = `Mengedit Gambar AI (${m}:${s})<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Tetap berjalan jika keluar/refresh</span>`;
                }
            };
            updateTimer();
            this.pollTimer = setInterval(updateTimer, 1000);
        }

        try {
            // Lazy load Gradio client
            const { client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
            
            const inputs = [
                this.uploadedImageFile, // image
                prompt,                 // prompt
                lora,                   // lora_adapter
                null,                   // image2
                0,                      // seed
                true,                   // randomize_seed
                1.5,                    // guidance_scale
                4,                      // steps
                true,                   // preserve_identity
                65,                     // identity_strength
                1280,                   // output_size
                false                   // fix_hands
            ];

            let result;
            let retryCount = 0;
            const MAX_RETRIES = 8;
            
            while (retryCount < MAX_RETRIES) {
                if (this.isCancelled) return;
                try {
                    const token = I2I_TOKENS[Math.floor(Math.random() * I2I_TOKENS.length)];
                    const app = await client("kulkas2pintu/QWEN_EDIT_IMAGE", { hf_token: token });
                    
                    if (this.isCancelled) return;

                    const predictPromise = app.predict("edit", inputs);
                    const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error("Generation timeout (Server Hugging Face sedang antre/padat).")), 180000)
                    );

                    result = await Promise.race([predictPromise, timeoutPromise]);
                    if (this.isCancelled) return;
                    break; // Success
                } catch (e) {
                    if (this.isCancelled) return;
                    const msg = (e && e.message) ? e.message.toLowerCase() : '';
                    // Retry on any transient/network/quota/timeout/server error
                    const isRetryable = msg.includes("zerogpu") || msg.includes("quota") || msg.includes("timeout") ||
                        msg.includes("queue") || msg.includes("busy") || msg.includes("rate limit") ||
                        msg.includes("network") || msg.includes("fetch") || msg.includes("failed") ||
                        msg.includes("500") || msg.includes("503") || msg.includes("502") ||
                        msg.includes("connection") || msg.includes("error");
                    if (isRetryable && retryCount < MAX_RETRIES - 1) {
                        retryCount++;
                        const lt = document.getElementById('i2iLoadingText');
                        const sec = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
                        const m = String(Math.floor(sec / 60)).padStart(2, '0');
                        const s = String(sec % 60).padStart(2, '0');
                        if (lt) lt.innerHTML = `Ganti token server AI (${retryCount}/${MAX_RETRIES}) — ${m}:${s}<br><span style="font-size: 11px; opacity: 0.8; font-weight: normal;">Mencoba server lain...</span>`;
                        console.warn("I2I: Retrying with new token...");
                        await new Promise(r => setTimeout(r, 1500));
                        continue;
                    }
                    throw e;
                }
            }
            
            if (this.isCancelled) return;

            this.hideI2ILoading();
            Utils.toast('Gambar berhasil diedit!', 'success');
            
            // Remove pending job
            localStorage.removeItem('nova_i2i_pending_job');

            // Display result and cache
            if (result && result.data && result.data[0]) {
                const imgData = result.data[0];
                const imgUrl = imgData.url || imgData.path;
                this.showResult(imgUrl, true);
                // Deduct Quota Only on 100% Success
                if (window.QuotaManager) {
                    QuotaManager.consume('image');
                }
            } else {
                throw new Error("Invalid response format from Gradio API");
            }

        } catch (error) {
            if (this.isCancelled) return;
            console.error("I2I API Error:", error);
            this.hideI2ILoading();
            localStorage.removeItem('nova_i2i_pending_job');
            Utils.toast(error.message || 'Generation failed. Please try again.', 'error');
        } finally {
            if (!this.isCancelled && this.generateBtn) {
                this.generateBtn.disabled = false;
                this.generateBtn.innerHTML = originalBtnText;
            }
        }
    },

    showResult(imageUrl, saveCache = true) {
        if (!imageUrl) return;

        this.lastGeneratedImageUrl = imageUrl;

        if (saveCache) {
            try {
                localStorage.setItem('nova_i2i_last_image', JSON.stringify({
                    url: imageUrl,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.warn("Could not cache image URL", e);
            }
        }

        const resultPlaceholder = document.getElementById('imageResultPlaceholder');
        const finalResultImage = document.getElementById('finalResultImage');
        const imageActions = document.getElementById('imageActions');
        const resultPreview = document.getElementById('imageResultPreview');

        if (resultPlaceholder) resultPlaceholder.classList.add('hidden');
        if (finalResultImage) {
            finalResultImage.src = imageUrl;
            finalResultImage.classList.remove('hidden');
        }
        if (imageActions) {
            imageActions.classList.remove('hidden');
        }

        // Setup download button
        const downloadBtn = document.getElementById('downloadImageBtn');
        if (downloadBtn) {
            const newBtn = downloadBtn.cloneNode(true);
            downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);

            newBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                try {
                    const res = await fetch(imageUrl);
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `nova-image-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    Utils.toast('Download gambar berhasil!', 'success');
                } catch (err) {
                    window.open(imageUrl, '_blank');
                }
            });
        }

        // Setup fullscreen/zoom button
        const fullscreenBtn = document.getElementById('fullscreenImageBtn');
        if (fullscreenBtn) {
            const newFsBtn = fullscreenBtn.cloneNode(true);
            fullscreenBtn.parentNode.replaceChild(newFsBtn, fullscreenBtn);

            newFsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                Utils.openMediaLightbox('image', imageUrl);
            });
        }

        // Also make clicking the image preview container open the zoom modal
        if (resultPreview) {
            resultPreview.onclick = (e) => {
                if (e.target.closest('#i2iCancelBtn')) return;
                if (this.lastGeneratedImageUrl) {
                    Utils.openMediaLightbox('image', this.lastGeneratedImageUrl);
                }
            };
        }
    }
};

window.ImageEditor = ImageEditor;
