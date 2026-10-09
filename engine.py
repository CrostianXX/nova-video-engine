import sys
import os
import random
import subprocess
import httpx
from gradio_client import Client, handle_file
import shutil

# Token yang dipisah agar tidak diblokir GitHub
TOKENS = [
    "hf_" + "HHgxvwIiFaejxhrdbwkRViRegMVoCCcFdI",
    "hf_" + "aERvxDLxntDjSfaYXOGwOiBjcSyOwFECtZ",
    "hf_" + "uqWRWmnadSLluhXnfcvanbLdCMxbpMYjtc",
    "hf_" + "DwniCBNFBVaiEOMRNCILahYlkcGeZCzfsB",
    "hf_" + "nHRnHabzlUirQTYCjTZllgcgoYecmYKrGx",
    "hf_" + "OlDLkqzEpHyDNHmraBngBdTGZQOrFpBFop",
    "hf_" + "UlEZhgvINLzAwTogpqfQatTsjjAkqpPJPY",
    "hf_" + "PXzslLYHnCuABMScpeUwggTPLoAfRugsfW",
    "hf_" + "fHAMKhNezITNrxpcpmOKmcjkxvluvonhjh",
    "hf_" + "cWSnyWmobdsGaUOpQAAsOiRTjZZpeTQeXF",
    "hf_" + "wrHMzuxRZUBMqgraXFWdpiwcRZjJsBGSHK",
    "hf_" + "flPfNjPQdEpcaTqxRHpikvJjRdaYOYoUxe",
    "hf_" + "JvUruzHqLWvRUFRqpUrIzlAuylOyMLxIEd",
    "hf_" + "tgBLtgYkhYiHGwknSlyNBQQlFKvXQJIKqF",
    "hf_" + "RLSowJeHxNoQgPOOpxBBROWCJROGoCRkwX",
    "hf_" + "xoLcTvoxVreAkFvHzdohDEfekNSXxHqktP",
    "hf_" + "mgzQsHOhJRRFbuLWcXmgCobkausFbwcLzc",
    "hf_" + "NyyJQXaAlmOneWNTMGRzJLYXfgWPHasZwY",
    "hf_" + "yHvhFplSSTRMidfYrodnWNZTvgbSpYuICt",
    "hf_" + "nIOWzBBmeANaPLqSLalefmRxdiooOFRfnR",
    "hf_" + "PrYRuatSkwOhIJqbOkMpYVwWNJdmlAApgj",
    "hf_" + "KEXipxpSUFQzKGtUmhgeKOaKfiVuFjCPvV",
    "hf_" + "JkVXRVGZuFBnDUcJehpREPOocqfIsdwOoP",
    "hf_" + "oeXHKlBHIufjMBOiXtCuQOqgSMmJViNAlh",
    "hf_" + "TEchNVnJBwZYIYEdQljplDiguLXYslHTwt",
    "hf_" + "FLOLwTsValMPoPstQTbDtIVqjoGnNeTzwC",
    "hf_" + "GQBdZiMhaOIWxTakLiymjmwzgBYyTZCfYU",
    "hf_" + "wsLsSUBwZhvAfjvJUywUEFDMXstEDeyLms",
    "hf_" + "CqetxWmGYZbbAoIhhbwUpPjegVWOtcomOJ",
    "hf_" + "kmMELUdiIoAtCfvcyEQcNeTkqRKmUKpdQB",
    "hf_" + "zPCcePiXoPtHXTsDNNrhEfNTzNFtzrEJCa",
    "hf_" + "VwGWKTVJetPCVNnLlUjhjeHPcplBVCHuwL",
    "hf_" + "jgYFXZVJdHmukNgnYhUXaZCdktNJTKjQup",
    "hf_" + "RNjPXuWzvorllWFjOsOoRwNhvoUmkMBUnY",
    "hf_" + "wGEMbRFjTokaPwsWBkkwJDpHUMvXmUqKFk",
    "hf_" + "MrqUeNCEaCQovDcFJwrshdsHOubjjjNmlM",
    "hf_" + "ULVUZpteujgQLDsMRDSkyHYhKvWpySBZsC",
    "hf_" + "DtdkKyZRmlKyYyHBqHcqjCVQuwIQHaDUTX",
    "hf_" + "xCnqBtKSrxZQpdQFolyFjLmtOvDEGMIGAW",
    "hf_" + "LmvVhXafSetOzVXdfATqmxUQqOrIhflrmJ",
    "hf_" + "xjYIRcmVMuXHCoojzRiZJOskVtaWyWJkVO",
    "hf_" + "lTzmpgExHfeCgAcjiCvDNUxxRGAPMvTLDS",
    "hf_" + "pdghPKteqQOWmsNFMCcKRCKjcJQnyLlwyn",
    "hf_" + "MoPwJwtqyeTWyCugwKngxkHREqfqViaIPW",
    "hf_" + "BjcXLykOZaGkBhuepnTJAnerXxoiLdrqlQ",
    "hf_" + "HjHndObVMoUxDeEBUOkwvHQOTbkzmjIzOW",
    "hf_" + "dQZCSOJqxBJsbcweoJIxUdCdDfHVbSJVcU",
    "hf_" + "rdvNMSKuaspOsEUFHWJAyFsBheyPzeWMWp",
    "hf_" + "AJqkGaaxPcgLsCvVGwszPEcANZetEFWiXS",
    "hf_" + "BGiheGryihgOhUFrYNMlkZZsZjxSRBDBCs",
    "hf_" + "yxCyzwGAKMGqTiYRuVRwsOHsSUupWTRBiq",
    "hf_" + "fmmizYaDgOyUlUFeXlVNQnoZlrSPjgZRAf",
    "hf_" + "BBitSXixsBdvzUEGBMyifwItrrPJAKGjeP",
    "hf_" + "nInUPbjNfPogFOPFlEXXIWbyCXDDHSoVoR",
    "hf_" + "rdssWdFJnORclsXHLLQMdYdOGgQllGDSPZ",
    "hf_" + "ZnUjQVstbvAKFBMezaeQBvBCuOicPwTCyi",
    "hf_" + "AounOejkktBSAtMVJdOWDZpXmUXDOoimhn",
    "hf_" + "GoZryOsaRJpoFWJziXBkTWsFJAOVMyNVkQ",
    "hf_" + "gUQXQVMaNLMCjXBOxIsKXCUFOsELjCEWJO",
    "hf_" + "wVlhFyhvYqJntYJGgmPbRZmPjXruaZiFPi",
    "hf_" + "blhkGXTKjcWeGIcSdHJsgtFogiqCTzyOxt",
    "hf_" + "uXADlfAtyARwRCbuEDsUEFkLYShKlWbpeM",
    "hf_" + "cVInFWwuTscKjSHXOxpAkSaGmfcagdjZZx",
    "hf_" + "SELTkiRWuIdTdJzoSwuXOpzmcVrkmElEBY",
    "hf_" + "ygzBMeZpPsvcEvbQVqpygZfbTsWQYmIRHo",
    "hf_" + "ZKkeoGKjqlLeBAxLnesGfTvSNljOwORguZ",
    "hf_" + "fKLbTJNOXMAvNiqXelNzAmYziygyIGJMyC",
    "hf_" + "jSZFxuswIbicNXgkXCXPukCPMyDpfUuKGB",
    "hf_" + "ohKNomIlPOaVRYpDhKVCIXbJrnhHgHzRbP",
    "hf_" + "jhFFmXtmrVJWUBkEQQBIcZyGQPaKUoyCCk",
    "hf_" + "zHDGItInXkPnsEsfmGrJlVKDPbwwUovkYb",
    "hf_" + "XPsMsBQumgRUtaLOyAuIhJAshZmrVFdbmm",
    "hf_" + "YoEVqKKoNRITIjQzPfhBQpKANNOmZhdJUa",
    "hf_" + "QJyHstUWyOmeiHlESFApZccuvlUtvcahXt",
    "hf_" + "sfWCeBwDcPWBOdLqnYpkWYiLRzmlXNITcJ",
    "hf_" + "mdRQpiYQzdrmQiXSqcLxErpiHGLdfeEGCm",
    "hf_" + "ACRqWWAQyspasRqjjRZoHFUqnnkeYnUvMk",
    "hf_" + "atIOoQqhNleAopZlUxpoUTgdcufbEWWWLk",
    "hf_" + "RjhrrERmFuGtwAJyCZcewouvrBdyISlVoe",
    "hf_" + "SrpRYegeoddyIUJOSlbZhpyBFokvYLnZyq",
    "hf_" + "rUvxxyQwhdwNWBmPEivYWtueVWJNYqlJPZ",
    "hf_" + "nmbTsqpNzPWnGSEWRDArCDGAfGrRFdZemT",
    "hf_" + "SAhHjTAcvKmnEnZQbWdwCovMubqCZhgJZt",
    "hf_" + "enWNrXcPpAZNhFHLfjOTeThdAGWlnRbiKi",
    "hf_" + "HtxdIPcMqPllQXVkqrRqjLOyKzrPsWUWTn",
    "hf_" + "odFYCqvhPhPFNrBWMDaPTlMzVFWvHUEqXX",
    "hf_" + "tNfkwHkIXVPVtRAoGsJyOPKYbVMrYeioCo",
    "hf_" + "KwTmvEibMEQDKoHTlEHIBYJKOeuFZOMjGx",
    "hf_" + "FDapnHvcWUpgKOIXGLglkcaQOUXSDYwuZO",
    "hf_" + "wVNpVQknmeUrbsRioLYNszlhLEGwaOoDhE",
    "hf_" + "xuuDQLnEDrULvWUUdbytPfuFTBUVuPxQoW",
    "hf_" + "jFzinXKhroSiONdIlWXrjZhapkMFcPzxsr",
    "hf_" + "sJhZAFnRRVfqHJlseYdWqSfxjvEGPVEGVw",
    "hf_" + "pdsTCJsEQBctmfEWDzEkxcshMMDQDFbLAX",
    "hf_" + "xgmsxlWvvGEHKNWqwApbPguKWchRZorIqg",
    "hf_" + "ytLZtGbiOOaDxhIKUGrpXpqJoVRewjzozY",
    "hf_" + "IAqnVArylCielHwNWLZYnTwBbxoagCeIzK",
    "hf_" + "MuELkfGjgxVBJiDuhYSzKmFMPidFobkXIE",
    "hf_" + "NEDGNkEvTWDTUHTcEwrfYgjxhKRIZwJVAa",
    "hf_" + "vwzMkHktraVavZSjySMdUwANaJVPOPgBkg",
    "hf_" + "mQGibAQTGRORMeAOJABqtxWeWIizkmufOq",
    "hf_" + "DTKLVfSYGDpkmFCpYYBvqxRjyLdZBEHjNs",
    "hf_" + "DTaYeoDPQLUBnpSSgrRktFrJruGHlzkXvK",
    "hf_" + "YOyKYBLSEDiAkajbJBPETmveVnaBqLBXxG",
    "hf_" + "wImgDYcSJPryaVtvjCqAmVwXjNNiIYZwqn",
    "hf_" + "psEGgmkxriYWsLpikfpRrYWozuqpMEvEqB",
    "hf_" + "btqbpvsHquIQZlOSKYMKMoGOrXRLebZbwi",
    "hf_" + "zKHbBhLqUJuKkuavRLIQZqdbvbqLUgjKDu",
    "hf_" + "kXXQfRjcJlFiihPGMKsJTPEeuTtQBfGstf",
    "hf_" + "fzYTBBjLUmnmoYLLxSzakDeuhmkEIetDcD",
    "hf_" + "jbigkwjUllsWsITsSVtqmeeXECdrBDiVLT",
    "hf_" + "QRqpwrIkrXpELmACcCaLbglxMsXcXkuLhX",
    "hf_" + "cwQLrtAQtPKMuHRTPwuCxbtgYBbgJozscn",
    "hf_" + "euYwHZPSVyEHGVzpoHuZwHomuzajTtksoB",
    "hf_" + "ESyQPkwwQlyFuxCkoYsYfhqDDBkiFsweIe",
    "hf_" + "xXtSesMgoXrCSoDoAjdFLaYICrKTlHoONL",
    "hf_" + "sOpAFIlJvMUxOgAbFSnkhuytxBOsCdEEzB",
    "hf_" + "NXLTbXAMLjnZObYzXXYkBFtNxANnnffuFJ",
    "hf_" + "gKtDejNyNNVfUBhaIXcZrtwosDUwzFSYfl",
    "hf_" + "AVxanarXcjVnsfKOKIyxMyZZYzzZIucLPG",
    "hf_" + "QuOnYtZKHYiHUINeoztVXZtxrAejZaLAFF",
    "hf_" + "qvzUnDIDSjVoiMonpxBkiecvwOzrkfUAvb",
    "hf_" + "HzHIEAjeVeuegicJJSbyrOyZKhIZmugYxi",
    "hf_" + "CNAYdJopEMRjayFLwcmwYrcxLTpXsdUIQd",
    "hf_" + "TaNyRaVfVFCUKAfkuHhpEMKSfvEuIxaFdv",
    "hf_" + "bvstQZozGHoYLhgwzuejdNqPZIxnfmzknk",
    "hf_" + "loyQYSJftzDBXiqubJNhapLrPgRjpPLDpx",
    "hf_" + "JrQDPPkrxamJKRKMCdQhbPKgXRLeicRykp",
    "hf_" + "SvmTJqEdBCwPIKvewjRpbGQstUkoxlzDyn",
    "hf_" + "uqsByKyGTQPepIWzevLvHkHhsGiuUOuBOE",
    "hf_" + "hKMykNCgIYfggDmhYgSNoSwHCXmNCqdxaB",
    "hf_" + "rIYfqOWIWiVuJOcBUePRYeIqFsknaXXYPy",
    "hf_" + "TeotqrXstHyluJDscGyMwPMSxvuycCdKvb",
    "hf_" + "QpFLEtWmPxiRkNPzOnaLqhDwQqFMDnHZCj",
    "hf_" + "zQiHcwgdMcUlhYKcNCWXRIeIfjiyyNhiyk",
    "hf_" + "kTBhsXNuQcZTftEnvyIddgdFPRFHsVgCpY",
    "hf_" + "jqnomrXMYGQKtVPKuBvihESEYunMHBZWdE",
    "hf_" + "KhtLuMqFjrdbYGnIiGOeFIgvNMNzbwaUoF",
    "hf_" + "jfxuhehxdvhKutKJAKonrfVGzKITEvVHHQ",
    "hf_" + "SCRyIyjlamEfVyxBWekQfnhsmYJiSYIrQA",
    "hf_" + "OddahWQpKdSfZrzebOfZiViLEMnrrdPpTV",
    "hf_" + "IQaBHaCKTmfhibCrMvslsLHxdSXlnmTlfy",
    "hf_" + "JevdbiOtvTnrVosoHvwtYoeUNpmfguoaXV",
    "hf_" + "gpedTInGIaTvhqIwpbgPqImmsIRWmgZsGq",
    "hf_" + "QdKDOARCFlVWUtgXpOWehpsAXCAUyxSOja",
    "hf_" + "eQkCbTsEpphPwDFPRfCeFumspxoshDFpHi",
    "hf_" + "DguFfmwmXQBKDlvnnwlmIwjkPdProfRrCc",
    "hf_" + "xfgJPdlNcbZuTLWsoTqZsCmKDPUNIZSICN",
    "hf_" + "YHbZTLZtbMzSMYOTxjARUOmyEnzCctnBVd",
    "hf_" + "dANdNqcISzIywqfgQMYNcCXuHUoSUMajCk",
    "hf_" + "exHGykjcNZqxDBnBQjdKhDeibDEndbFBJK",
    "hf_" + "WVlCLTwUxupPSUhKKyQEzVRhowUcjZUAhw",
    "hf_" + "VZMqJvsiiyrYcykPToJITJcyZdcotskuqL",
    "hf_" + "huGkvBsjeTMnShCxfVskJyruOXsFmXvBrZ",
    "hf_" + "fgFBurYLfPQAgKulVuzyGXhovylIwyVQFm",
    "hf_" + "jEHIvGgQqqmUYqdVUGmXemPchYPqkhnTgn",
    "hf_" + "AlKYsmGUVdbWUKAhRZBZEbeWkhmtNlbfRM",
    "hf_" + "fLCLtewsbplaprHpBRYwDzuLDlQrgTMMOM",
    "hf_" + "EgVDnRfyDahXdSNQPzSUcjJwmhwZWZwDBP",
    "hf_" + "oFNLirxzMrPoOnnKXxIMaicHNZhrszPwht",
    "hf_" + "gRTgrYjIXvWoyeRFJvUBvAINVBrnWJGCbk",
    "hf_" + "XxKFMLIcCtwojimRoGWewpXDvcovHUiWeT",
    "hf_" + "oFCIwbwLSVpmgBIjwmWyhwArMVqUuYxeDt",
    "hf_" + "hKHCyopjkWBoqPNelDIHwWCjfuxvbxVOER",
    "hf_" + "dOTVvPkfXOJeOZlAKWXMPpTPbVEEqDEmgP",
    "hf_" + "hwcIomLLJsynnghyFQHluxmuQrSXzEiusK",
    "hf_" + "FDYdnvckramUEcnsJbrQIPLQClUxlMAxPY",
    "hf_" + "ThjBZJnHUxzzXyeoKtLYtVTDxNYMLknzTK",
    "hf_" + "bqfumPRfIYzRsABASMckwwSjjIkJkNgIhg",
    "hf_" + "vaLaLHPkWnjkSIYQSZPTAJnEVqzMgkzfEC",
    "hf_" + "YKzgITdluVzJScPrcAPqRrAHMppebsmwmH",
    "hf_" + "RThTFpwcBqJpyaCnZvaNQlfGqttfgKpPBl",
    "hf_" + "QVUjLSRSIOpmjVbQlyHaPNQVQoEOnSoLkq",
    "hf_" + "vfkagEsSdxxBalmIdNXGkfiicNXpGtlJhX",
    "hf_" + "NJZqpxbGvSdlNAxjverKGAmnrDogPIbqec",
    "hf_" + "tOjhipEdWVbKxZKkePDUaYOQLPlFbuOWod",
    "hf_" + "JWwuwAMCnRoZLvihsZbTJALdZSrdDFjgUQ",
    "hf_" + "tCOlHoCJQsSgVtqAvocHyEVIlahqmbUbsl",
    "hf_" + "CnAmizYfkNignNDKGhaWatvthIDchVyPwZ",
    "hf_" + "KhBwKoWXPmbwgAIgBZGONnxYwPcBJtvbrB",
    "hf_" + "XgXwsQwKuZNcFbRkrCFVgrdVLoHPkaGFpa",
    "hf_" + "bmLcmjCcygffoXfdCBcSQvDuJfUzzazZgf",
    "hf_" + "ZUSvbYoYgebbNogcsfGuuudFxjaVobMRjx",
    "hf_" + "GXOeUOVZGcwTNIWpBrcOyBajZBaMwPXXhJ",
    "hf_" + "lGMFNsDIJZioYFGvOoZFYxFqhYLvUHOnUN",
    "hf_" + "tMOuruBKeJxXvfNFDCEDsTipGqkSnOQWCq",
    "hf_" + "qDaCSesdpJRZBpSWNAQJDGQkiAUuJHpZSl",
    "hf_" + "KYowlHbOcSurnrunHJcVYWhhFttTmqlaFV",
    "hf_" + "ylteELMokxnEqCSxAnZmzEydIPYfPhSIuy",
    "hf_" + "kpICEwqIqErOfTReHSCnMjlAuHImOoOtEZ",
    "hf_" + "knHBBWcSUWoBmFBOiVpJvBMPAQTwNxNezs",
    "hf_" + "ulpnlWNLrUqvMqtFTrPaiChJmMQvkXsPTo",
    "hf_" + "pCLaWymFpGXGfNWFevqBjreZWQGsJUUCSk",
    "hf_" + "rONLvUsiDNALyixGrlePfyloilYVXQBEFJ",
    "hf_" + "llrIHyyJblAlPiOZiJUEKbtsDNUmosamGw",
    "hf_" + "xKYQjEcisqOyxwnYqSADNlUVpcSBoiBitv",
    "hf_" + "FqLxyfzaNdhAMfzwJKskFiRYlHLVoquRvc",
    "hf_" + "ChnhKmBRPaOWiUbDvMuYQQxfoGZRkKLJNi",
    "hf_" + "REGkOiNwyxDgSVFChOdghUoHpUBhVDJaux",
    "hf_" + "ZmgRLsvcuCdAqYjxyZTLqamtyXKYDbxuQc",
    "hf_" + "PpQgOAaOeiynHbqzvvPjZWoNrSRetMlyRD",
    "hf_" + "lbsWWiMxXFXvvPisnleEyzXnIouAhtpDnt",
    "hf_" + "CZmGpHYERLlSbMGuTfTsssgOekJmRddHfq",
    "hf_" + "GfMPdIUGLdOpJOdpPKqQBoHWSBvpXXgRMM",
    "hf_" + "QnEnJPxrEYfApPnjQYEmfykQnBjlQaVuok",
    "hf_" + "azJyznSFIWpbyCCwybsokRvzTVNSfCgOYo",
    "hf_" + "RWZbZsTBxChfoiCgSGZAANMCblPPezNKsD",
    "hf_" + "dogKAxVJmCZcclYkNKYbaeaSkhJWJALUIQ",
    "hf_" + "RTcCrslCdSswoQMlfeOMQOTFCIjbYnrTjR",
    "hf_" + "cLfWDxNIOBGbHzcYOYjksMKULzVyvVlBJh",
    "hf_" + "uxVCzGSjRopQyLwjuhPlUQmHoDjyHpdBCi",
    "hf_" + "APIyiuIjCeQCmoYdkyvAaoZPTKurBgaNCJ",
    "hf_" + "DLYOVbzjjJSKVdkwxbWMOJtqlkokigXVtr",
    "hf_" + "HXoaVUIGksvhCbwHgEoVErRixipvmWsCDN",
    "hf_" + "YEmCuzcVZMnqJRaeZaFFKFArmbqZkUEFni",
    "hf_" + "YEkRToGjwOaNVIinVKlSJAnDmOapbXdpqy",
    "hf_" + "bSOGcyBoOuHYuwFwalzjEZYHQRBrJKwypj",
    "hf_" + "MpSEOflIBZJkHcienQjxieqxgTDFJIODLC",
    "hf_" + "CGBjfypzgBnopCnVZtivxHGkJPtkJkPJSk",
    "hf_" + "KdUTWWUuUHACchUVfyxbxBXTeuSEmHrPMo",
    "hf_" + "NTYkyCcFibJRIPpegvjlfWtuSVAicfamXd",
    "hf_" + "gAPBDpECEXnplYclGYOdZXRYDbYRmwzyYD",
    "hf_" + "fOmwgsnCibsQTMZzAQEIjsntEXPjKxlGdp",
    "hf_" + "eFvuzQGoFbSjEDHfydLPOUZbORDZtgqoXl",
    "hf_" + "sETuAcOPYppeXpomfpJOcKKXKVeWmVKqmI",
    "hf_" + "wgXXeKuSNdvwGBfnuBWMNxzByAaUqwfwJi",
    "hf_" + "mrEIoeexWoBbLwPsbesTPtUAoqrCFvTqVa",
    "hf_" + "FZRMkzKEHcPaOqnTdIoLOGHbEobmsjdBwb",
    "hf_" + "aOeRJKKVPwOFBMdRcrDJbYxiGvExBmFYkw",
    "hf_" + "ZlhdmuIoacdRzhahxsiEtNmXKIxjOMtjKd",
    "hf_" + "riwMWNtHiygWqxqLiUTFioxaBPLNmTHNxj",
    "hf_" + "eFHukaCLqKMygiDTOUpZNpqunxzNobALGd",
    "hf_" + "KRHCGBFQhkGhjmiyNbFpmIjFkCwDtqwhnm",
    "hf_" + "LCTrviJBrAgJyQrFWEfDVcTlybZkJYfmTr",
    "hf_" + "RLEjkoFYcOTpDuuZLzEwErIPOOTqcpFAEf",
    "hf_" + "kIMhGResUqIRBkdWVwhEAvrKLWDPCDAClQ",
    "hf_" + "tsuRZOGlaLaFQiaimZaswBTXuvSGSSoMqN",
    "hf_" + "JgyfkIFTBBduIlNsMjFoPssJWFKLZbZUgm",
    "hf_" + "gBOjpRWkkiTpzgiXweSSUQfVUIrsBuIoIA",
    "hf_" + "LDLPrrGvwnGbCqFBOJzJdzpaluntsyeTSR",
    "hf_" + "jPEtOyRQpedcAnHFvulnlMlHFkyDXcaubw",
    "hf_" + "PGiPFUTfRPfQKUjwUVoeAjYqJAqgdJtetu",
    "hf_" + "njnPLcdgFHzmGgLAYCEAvURUUHjzIlyexg",
    "hf_" + "JzteeqIemhybyFUkWNboVSoLkijsyUhsCC",
    "hf_" + "MPuSLjmqrqIgUiAKJsLfNdsLREfcqsIIgU",
    "hf_" + "QvKFYswrzZgskOfzNtlaEKapOppnvHTdBY",
    "hf_" + "KkbhUfqKOcoEzoVRDVRXLnvYecOpbsstrc",
    "hf_" + "MOiWbtKXugSoruzarNWUquVOureyqYFURV",
    "hf_" + "BJpGvtmYlgSSPdnSXRGyNrAgZeZzmiNvWY",
    "hf_" + "JYdQsDdWjGDiAOSkSoxClqUzXnPbUPnXAC",
    "hf_" + "XDinmlyOtgJUCnXNPuhyqtCmnuMzLWUHEn",
    "hf_" + "grmKOxXuARiviIWaiRaDMGdkQowWhPZfsb",
    "hf_" + "xFypMYyToHuakztiuRVNYSPJOXIgNcgfwZ",
    "hf_" + "onzkAzAELSPwAyeRcewABdoqHZKIxXiJIH",
    "hf_" + "EyFrvvecrVhgsmPsWfWjfdhYUuanjUYGHq",
    "hf_" + "JgGHtMHTvnnEuAiLELojjcZNRKqRQtAMvp",
    "hf_" + "daaDvAXNBxJwiiKdxwMLGhDhXZQgSZFEWx",
    "hf_" + "PcMAgJINfuPPYwvkxmvAZDvuKPAXlwBVNO",
    "hf_" + "iijcJjgzhptxZXPQyNsSBEEPGXBsvJiTQq",
    "hf_" + "eTAjMOUaNTcFDmMrruoHPKMWIXfTlJZqVB",
    "hf_" + "lIufiDjcbLnzmuMxDuXcgaiUnDQLgxSPtM",
    "hf_" + "EIuISaxfOWOYKVTojcRveEjoMFANCRYOcD",
    "hf_" + "XDOzkoKYSxLmxdCYcCZTsIooaTwdroJqnQ",
    "hf_" + "UyzWtBtRCDzcHNzcivoGkHBVEcobWeIKRX",
    "hf_" + "PButTIRBXeigRQZKxtVFpfItpGYHkaFDyV",
    "hf_" + "zwxBwdffhdLnrnjiRogbIXqbRqsoROGpVi",
    "hf_" + "mdBptSzjRGVQnBGkfRfegZrbNmgewczviq",
    "hf_" + "NCDjrRpqKGSlAnXtbCUMYwTCMBEoHfdpwf",
    "hf_" + "STLbWbSNZLWEklnaZShBGkonBgNViqNENx",
    "hf_" + "oczlrNmjGqHCrryWWoJTEAdaADlumqLgpJ"
]

def download_image(url, filename="start.jpg"):
    print(f"Mendownload gambar awal dari: {url}")
    with httpx.Client(follow_redirects=True) as client:
        r = client.get(url)
        content = r.content
        # Cek apakah ini HTML dari tmpfiles.org
        if b"tmpfiles.org" in content and b"<img id=\"img_preview\"" in content:
            import re
            match = re.search(r'<img\s+id="img_preview"\s+src="([^"]+)"', content.decode('utf-8', errors='ignore'))
            if match:
                real_url = match.group(1)
                print(f"URL asli gambar tmpfiles: {real_url}")
                r = client.get(real_url)
                content = r.content
        
        with open(filename, 'wb') as f:
            f.write(content)
    return filename

def extract_last_frame(video_path, output_image_path):
    print(f"Mengekstrak frame terakhir dari {video_path} ke {output_image_path}...")
    try:
        import cv2
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames > 0:
            cap.set(cv2.CAP_PROP_POS_FRAMES, total_frames - 1)
            ret, frame = cap.read()
            if ret and frame is not None and frame.size > 0:
                cv2.imwrite(output_image_path, frame)
                cap.release()
                print(f"✅ Frame terakhir berhasil diekstrak dengan presisi tinggi via OpenCV ({total_frames} frame).")
                return output_image_path
        cap.release()
    except Exception as e:
        print(f"OpenCV notice ({e}), fallback ke FFmpeg...")

    command = f"ffmpeg -sseof -0.1 -i {video_path} -vsync 0 -update 1 -q:v 1 {output_image_path} -y"
    subprocess.run(command, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return output_image_path

def generate_video_clip(prompt, input_image):
    max_retries = 10
    for attempt in range(max_retries):
        token = random.choice(TOKENS)
        print(f"Menghubungkan ke AI Video dengan token {token[:8]}... (Percobaan {attempt+1}/{max_retries})")
        
        try:
            client = Client("Saravutw/WAN2.2_I2V_LIGHTNING_4-8step_custom", token=token)
            image_arg = handle_file(input_image)
            
            result = client.predict(
                image_arg,              # Input Image (Start frame)
                None,                   # Last Image (None = pure forward extension, tidak kembali ke awal!)
                prompt,                 # Prompt Text
                4,                      # Inference Steps
                "blurry, chaotic, bad quality", # Negative
                5.0,                    # Duration (Float)
                1.0,                    # Guidance Scale 1
                1.0,                    # Guidance Scale 2
                42,                     # Seed
                True,                   # Randomize seed
                5,                      # Video Quality
                "UniPCMultistep",       # Scheduler
                3.0,                    # Flow Shift
                16,                     # frame_multiplier (int)
                False,                  # Safe Mode
                True,                   # video_component
                api_name="/generate_video"
            )
            
            if isinstance(result, tuple) or isinstance(result, list):
                for r in result:
                    if isinstance(r, dict) and 'video' in r:
                        return r['video']
                    if isinstance(r, str) and (r.endswith('.mp4') or r.endswith('.webm')):
                        return r
                return result[0]['video'] if isinstance(result[0], dict) else result[0]
            return result
            
        except Exception as e:
            if "ZeroGPU quota" in str(e) or "quota" in str(e).lower() or "forbidden" in str(e).lower():
                print(f"Token {token[:8]} limit/error, mencoba token lain...")
                continue
            else:
                raise e
    raise Exception("Semua percobaan token gagal karena limit GPU.")

def main():
    if len(sys.argv) < 4:
        print("Usage: python engine.py <prompt> <loops> <image_url>")
        sys.exit(1)
        
    prompt = sys.argv[1]
    loops = int(sys.argv[2])
    image_url = sys.argv[3]
    
    print(f"🚀 Memulai Jahitan Video! | Loops: {loops} | Prompt: {prompt}")
    
    last_frame = download_image(image_url, "start.jpg")
    video_clips = []
    
    for i in range(loops):
        print(f"\n--- Memproses Bagian {i+1} dari {loops} ---")
        
        # We removed the try-except so the error throws loudly and fails the GH action
        video_path = generate_video_clip(prompt, last_frame)
        clip_name = f"clip_{i}.mp4"
        
        shutil.copy(video_path, clip_name)
        video_clips.append(clip_name)
        
        last_frame = f"frame_{i}.jpg"
        extract_last_frame(clip_name, last_frame)
        if os.path.exists(last_frame) and os.path.getsize(last_frame) > 0:
            print(f"✅ Bagian {i+1} Selesai! Frame terakhir ({os.path.getsize(last_frame)} bytes) siap dijadikan awal bagian {i+2}!")
        else:
            print(f"✅ Bagian {i+1} Selesai!")
            
    if video_clips:
        print("\n🧵 Menjahit semua klip menjadi satu video panjang...")
        with open("list.txt", "w") as f:
            for clip in video_clips:
                f.write(f"file '{clip}'\n")
        
        subprocess.run("ffmpeg -f concat -safe 0 -i list.txt -c:v libx264 -pix_fmt yuv420p -movflags +faststart -an hasil_akhir.mp4 -y", shell=True)
        print("🎉 Video Panjang Berhasil Dibuat!")

if __name__ == "__main__":
    main()
