//! CONSOLE.LOG İLE EKRANDA JS BAĞLANDI MI KONTROL EDİYORUZ
// console.log(`Selam Js`);

// ! DÜZENLEME DEĞİŞKENLERİ (LET KULLANARAK BU DEĞİŞKENLERİ TANIMLADIK)
let editMode = false; //! DÜZENLEME MODUNU BELİRLEYEN DEĞİŞKEN
let editItem; //! DÜZENLEME ELEMANINI BELİRLEYEN DEĞİŞKEN
let editItemId; //! DÜZENLEME ELEMANININ ID Sİ

// ! DOCUMENT.QUERYSELECTOR KULLANARAK HTML'DEN CLASS/ID LERİ JAVASCRIPTE ÇAĞIRMA
const form = document.querySelector(".form-wrapper");
const input = document.querySelector("#input");
const itemList = document.querySelector(".item-list");
const alert = document.querySelector(".alert");
const addButton = document.querySelector(".submit-btn");
const clearButton = document.querySelector(".clear-btn");


// !!!!!!!! FONKSİYONLAR

//! KULLANICI FORMU DOLDURUP GÖNDERDİĞİNDE ÇALIŞACAK FONKSYON 

const addItem = (e) => {
  //! ''e.preventdefault'' ile Sayfa'nın yenilenmesini iptal ediyoruz. 
  e.preventDefault();
  const value = input.value;
  if (value !== "" && !editMode) {
    const id = new Date().getTime().toString();
    createElement(id, value);
    setToDefault();
    showAlert("Eleman Eklendi", "success");
    addToLocalStorage(id, value);
  } else if (value !== "" && editMode) {
    editItem.innerHTML = value;
    updateLocalStorage(editItemId, value);
    showAlert("Eleman Güncellendi", "success");
    setToDefault();
  }
};

//!  ALERT UYARI İÇİN FONKSTON, textcontent ile alertin içeriğini yazdık, class ekledik, ve süre ekledik 
const showAlert = (text, action) => {
  //! Alert kısmında ne yazacağını belirtiyor
  alert.textContent = ` ${text}`;
  //! Alert kısmına class ekledik
  alert.classList.add(`alert-${action}`);
  //! Alert kısmının içeriğini güncelle ve class ı kaldır
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};

//! ELEMANLARI SİLMEK İÇİN FONKSYON
const deleteItem = (e) => {
  //! Silmek istenen elemana erişmek istiyoruz
  const element = e.target.parentElement.parentElement.parentElement;
  const id = element.dataset.id;
  //! Elemanı Kaldır
  itemList.removeChild(element);
  removeFromLocalStorage(id);
  showAlert("Eleman Silindi", "danger");
  console.log(itemList);
  //! Hiç eleman bulunmadıysa sıfırlama butonunu kaldır
  if (!itemList.children.length) {
    clearButton.style.display = "none";
  }
};

//! ELEMANLARI GÜNCELLEYECEK FONKSYON, BURADA CLASS IN BİR ÜST CLASS INA, SONRA BİR ÜST CLASS INA DAHA ULAŞTIK PARENTELEMTN İLE

const editItems = (e) => {
  const element = e.target.parentElement.parentElement.parentElement;
  editItem = e.target.parentElement.parentElement.previousElementSibling;
  input.value = editItem.innerText;
  editMode = true;
  editItemId = element.dataset.id;
  addButton.textContent = "Düzenle";
};

//! VARSAYILAN DEĞERLERE DÖNDÜREN FONKSYON
const setToDefault = () => {
  input.value = "";
  editMode = false;
  editItemId = "";
  addButton.textContent = "Ekle";
};
//! SAYFA YÜKLENİLDİĞİNDE ELEMANLARI RENDER EDEN FONKSYON, GETLOCALSTORAGE BELİRLEDİK 
const renderItems = () => {
  let items = getFromLocalStorage();
  console.log(items);
  if (items.length > 0) {
    items.forEach((item) => createElement(item.id, item.value));
  }
};
//! CREATEELEMENT İLE ELEMAN OLUŞTURAN FONKSYON, INNERHTML İLE HTNL'DEKİ İÇERİĞİ REVİZE ETTİK 

const createElement = (id, value) => {
  // Yeni bir div oluştur
  const newDiv = document.createElement("div");
  // Bu div e attribute ekle
  newDiv.setAttribute("data-id", id); 
  // ! setAttribute ile bir elemana attribute ekleyebiliriz. Attribute bize DATA-ID yi verdi, bu id ye göre ekleme güncelleme yapabiliyoruz.
  //! ELEMAN OLUŞTURMAK İÇİN CLASS EKLİYORUZ DIV E. 
  newDiv.classList.add("items-list-item");
  //! INNERHTML KULLANARAK DIV İN İÇERİĞİNİ HTML DEN ÇEKEREK BELİRLİYOIRYZ 
  newDiv.innerHTML = `
           <p class="item-name">${value} </p>
            <div class="btn-container">
              <button class="edit-btn">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
  `;

  //! DELETE BUTOONUNA ERİŞMEK İÇİN 

  const deleteBtn = newDiv.querySelector(".delete-btn");
  //   console.log(deleteBtn);
  deleteBtn.addEventListener("click", deleteItem);
  // Edit butonuna eriş
  const editBtn = newDiv.querySelector(".edit-btn");
  //   console.log(editBtn);
  editBtn.addEventListener("click", editItems);
  itemList.appendChild(newDiv);
  showAlert("Eleman Eklendi", "success");
};

// ! SIFIRLAMA YAPAN FONKSYON, REMOVECHILD KULLANDIK 

const clearItems = () => {
  const items = document.querySelectorAll(".items-list-item");
  if (items.length > 0) {
    items.forEach((item) => {
      itemList.removeChild(item);
    });
    clearButton.style.display = "none";
    showAlert("Liste Boş", "danger");
    //! LOCALSTORAGE I TEMİZLİYORUZ REMOVEITEM İLE 
    localStorage.removeItem("items");
  }
};

//! ADDTOLOCALSTORAGE İLE  LOCALSTORAGE A KAYIT YAPIYORUZ
const addToLocalStorage = (id, value) => {
  const item = { id, value };
  let items = getFromLocalStorage();
  items.push(item);
  localStorage.setItem("items", JSON.stringify(items));
};

//! GETFROMLOCALSTORAGE İLE LOCALSTORAGE DAN VERİLERİ ALAN FONKSYON
const getFromLocalStorage = () => {
  return localStorage.getItem("items")
    ? JSON.parse(localStorage.getItem("items"))
    : [];
};

//! REMOVEFROMLOCALSTORAGE İLE VERİLERİ LOCALSTORAGE DAN KALDIRAN FONKSYON  
//! FILTER DA KULLANIYORUZ KALDIRMAK İÇİN 
const removeFromLocalStorage = (id) => {
  let items = getFromLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("items", JSON.stringify(items));
};

//! UPDATELOCALSTORAGE FONKSYONU İLE LOCALSTORAGE I GÜNCELLİYORUZ  
//! MAP TE KULLANIYORUZ GÜNCELLEME İÇİN 
const updateLocalStorage = (id, newValue) => {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      return { ...item, value: newValue };
    }
    return item;
  });
  localStorage.setItem("items", JSON.stringify(items));
};

//! ADDEVENTLISTENER - OLAY İZLEYİCİLERİ

//! ADDEVENTLISTENER - FORM'DA SUBMIT TUŞUNA BASILDIĞINDA(FORMUN GÖNDERİLDİĞİ ANI YAKALAMAK İÇİN)
form.addEventListener("submit", addItem);
//! ADDEVENTLISTENER - EKRANDA/WEB SİTESİNDE - DOMCONTENTLOADED(SAYFANIN YÜKLENDİĞİ AN)
window.addEventListener("DOMContentLoaded", renderItems);
//! ADDEVENTLISTENER - CLEAR TUŞUNA BASILDIĞINDA - CLEARITEMS(TEMİZLE)
clearButton.addEventListener("click", clearItems);