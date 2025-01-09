import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/*-----------------------------------------------Form--------------------------------------------------*/
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
// import { CascadeSelectModule } from 'primeng/cascadeselect';
import { CheckboxModule } from 'primeng/checkbox';
// import { ChipsModule } from 'primeng/chips';
// import { ColorPickerModule } from 'primeng/colorpicker';
import { DropdownModule } from 'primeng/dropdown';
// import { EditorModule } from 'primeng/editor';
import { FloatLabelModule } from 'primeng/floatlabel';
// import { IconFieldModule } from 'primeng/iconfield';
// import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
 import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
// import { InputTextareaModule } from 'primeng/inputtextarea';
// import { InputNumberModule } from 'primeng/inputnumber';
import { InputOtpModule } from 'primeng/inputotp';
// import { KnobModule } from 'primeng/knob';
// import { KeyFilterModule } from 'primeng/keyfilter';
// import { ListboxModule } from 'primeng/listbox';
// import { MultiSelectModule } from 'primeng/multiselect';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
// import { RatingModule } from 'primeng/rating';
// import { SelectButtonModule } from 'primeng/selectbutton';
// import { SliderModule } from 'primeng/slider';
// import { TreeSelectModule } from 'primeng/treeselect';
// import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
// import { ToggleButtonModule } from 'primeng/togglebutton';
/*-----------------------------------------------Button-------------------------------------------------------*/
import { ButtonModule } from 'primeng/button';
// import { SplitButtonModule } from 'primeng/splitbutton';
// import { SpeedDialModule } from 'primeng/speeddial';
/*-----------------------------------------------Data---------------------------------------------------------*/
// import { DataViewModule } from 'primeng/dataview';
// import { OrderListModule } from 'primeng/orderlist';
// import { OrganizationChartModule } from 'primeng/organizationchart';
// import { PaginatorModule } from 'primeng/paginator';
// import { PickListModule } from 'primeng/picklist';
// import { ScrollerModule } from 'primeng/scroller';
// import { TableModule } from 'primeng/table';
// import { TimelineModule } from 'primeng/timeline';
// import { TreeModule } from 'primeng/tree';
// import { TreeTableModule } from 'primeng/treetable';
/*-----------------------------------------------Panel-----------------------------------------------*/
// import { AccordionModule } from 'primeng/accordion'; //Accordion
// import { CardModule } from 'primeng/card'; //Card
// import { DividerModule } from 'primeng/divider'; //Divider
// import { FieldsetModule } from 'primeng/fieldset'; //Fieldset
// import { PanelModule } from 'primeng/panel'; //Panel
// import { SplitterModule } from 'primeng/splitter'; //Splitter
// import { StepperModule } from 'primeng/stepper'; //Stepper
// import { ScrollPanelModule } from 'primeng/scrollpanel'; //ScrollPanel
// import { TabViewModule } from 'primeng/tabview'; //TabView
// import { ToolbarModule } from 'primeng/toolbar'; //Toolbar  
/*-----------------------------------------------Overlay-----------------------------------------------*/
// import { ConfirmDialogModule } from 'primeng/confirmdialog'; //ConfirmDialog
// import { ConfirmPopupModule } from 'primeng/confirmpopup'; //ConfirmPopup
// import { DialogModule } from 'primeng/dialog'; //Dialog
// import { DynamicDialogModule } from 'primeng/dynamicdialog'; //Dynamic Dialog
// import { OverlayPanelModule } from 'primeng/overlaypanel'; //OverlayPanel
import { SidebarModule } from 'primeng/sidebar'; //Sidebar
import { TooltipModule } from 'primeng/tooltip'; //Tooltip
/*-----------------------------------------------File-----------------------------------------------*/
 import { FileUploadModule } from 'primeng/fileupload'; //FileUpload
/*-----------------------------------------------Menu-----------------------------------------------*/
// import { BreadcrumbModule } from 'primeng/breadcrumb'; //Breadcrumb
// import { ContextMenuModule } from 'primeng/contextmenu'; //ContextMenu
// import { DockModule } from 'primeng/dock'; //Dock
// import { MenuModule } from 'primeng/menu'; //Menu
// import { MenubarModule } from 'primeng/menubar'; //Menubar
// import { MegaMenuModule } from 'primeng/megamenu'; //MegaMenu
// import { PanelMenuModule } from 'primeng/panelmenu'; //PanelMenu
import { StepsModule } from 'primeng/steps'; //Steps
// import { TabMenuModule } from 'primeng/tabmenu'; //TabMenu
// //import { TieredMenuModule } from 'primeng/tieredmenu';//TieredMenu
/*-----------------------------------------------Chart-----------------------------------------------*/
// import { ChartModule } from 'primeng/chart'; //Charts
/*-----------------------------------------------Messages-----------------------------------------------*/
// import { MessagesModule } from 'primeng/messages'; //Messages
import { ToastModule } from 'primeng/toast'; //Toast
/*-----------------------------------------------Media-----------------------------------------------*/
// import { CarouselModule } from 'primeng/carousel'; //Carousel
// import { GalleriaModule } from 'primeng/galleria'; //Galleria
// import { ImageModule } from 'primeng/image';  //Image
/*-----------------------------------------------Drag Drop-----------------------------------------------*/
// import { DragDropModule } from 'primeng/dragdrop'; //Drag and Drop
/*-----------------------------------------------Misc-----------------------------------------------*/
// import { AvatarModule } from 'primeng/avatar'; //Avatar
// import { AvatarGroupModule } from 'primeng/avatargroup'; //Avatar
import { BadgeModule } from 'primeng/badge'; //Badge
// import { BlockUIModule } from 'primeng/blockui'; //BlockUI
// import { ChipModule } from 'primeng/chip'; //Chip
// import { InplaceModule } from 'primeng/inplace'; //Inplace
//import { MeterGroupModule } from 'primeng/metergroup'; //MeterGroup
// import { ScrollTopModule } from 'primeng/scrolltop'; //ScrollTop
//import { SkeletonModule } from 'primeng/skeleton'; //Skeleton
//import { ProgressBarModule } from 'primeng/progressbar'; //ProgressBar
//import { ProgressSpinnerModule } from 'primeng/progressspinner'; //ProgressSpinner  
//import { TagModule } from 'primeng/tag'; //Tag
//import { TerminalModule } from 'primeng/terminal';//Terminal
/*-----------------------------------------------Directive-----------------------------------------------*/
//import { DeferModule } from 'primeng/defer'; //Defer
//import { FocusTrapModule } from 'primeng/focustrap'; // Focus Trap
import { StyleClassModule } from 'primeng/styleclass'; //StyleClass
import { RippleModule } from 'primeng/ripple'; //Ripple
//import { AutoFocusModule } from 'primeng/autofocus'; //AutoFocus
//import { AnimateOnScrollModule } from 'primeng/animateonscroll';//AnimateOnScroll
/*-----------------------------------------------services-----------------------------------------------*/
import { MessageService } from 'primeng/api';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     AutoCompleteModule,
    CalendarModule,
    // CascadeSelectModule,
    CheckboxModule,
    // ChipsModule,
    //  ColorPickerModule,
    DropdownModule,
    // EditorModule,
    FloatLabelModule,
    // IconFieldModule,
    // InputIconModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
     InputMaskModule,
    InputSwitchModule,
    // InputTextareaModule,
    // InputNumberModule,
    InputOtpModule,
    // KnobModule,
    // KeyFilterModule,
    // ListboxModule,
    // MultiSelectModule,
    PasswordModule,
    RadioButtonModule,
    // RatingModule,
    // SelectButtonModule,
    // SliderModule,
    // TreeSelectModule,
    // TriStateCheckboxModule,
    // ToggleButtonModule,
    ButtonModule,
    // SplitButtonModule,
    // SpeedDialModule,
    // DataViewModule,
    // OrderListModule,
    // OrganizationChartModule,
    // PaginatorModule,
    // PickListModule,
    // ScrollerModule,
    // TableModule,
    // TimelineModule,
    // TreeModule,
    // TreeTableModule,
    // AccordionModule,
    // CardModule,
    // DividerModule,
    // FieldsetModule,
    // PanelModule,
    // SplitterModule,
    // StepperModule,
    // ScrollPanelModule,
    // TabViewModule,
    // ToolbarModule,
    // ConfirmDialogModule,
    // ConfirmPopupModule,
    // DialogModule,
    // DynamicDialogModule,
    // OverlayPanelModule,
    SidebarModule,
    TooltipModule,
     FileUploadModule,
    // BreadcrumbModule,
    // ContextMenuModule,
    // DockModule,
    // MenuModule,
    // MenubarModule,
    // MegaMenuModule,
    // PanelMenuModule,
    StepsModule,
    // TabMenuModule,
    // TieredMenuModule,
    // ChartModule,
    // MessagesModule,
    ToastModule,
    // CarouselModule,
    // GalleriaModule,
    // ImageModule,
    // DragDropModule,
    // AvatarModule,
    // AvatarGroupModule,
    BadgeModule,
    // BlockUIModule,
    // ChipModule,
    // InplaceModule,
    // MeterGroupModule,
    // ScrollTopModule,
    // SkeletonModule,
    // ProgressBarModule,
    // ProgressSpinnerModule,
    // TagModule,
    // TerminalModule,
    // DeferModule,
    // FocusTrapModule,
    StyleClassModule,
    RippleModule,
    // AutoFocusModule,
    // AnimateOnScrollModule,
  ],
  exports: [
   AutoCompleteModule,
    CalendarModule,
    // CascadeSelectModule,
    CheckboxModule,
    // ChipsModule,
    //  ColorPickerModule,
    DropdownModule,
    // EditorModule,
    FloatLabelModule,
    // IconFieldModule,
    // InputIconModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
     InputMaskModule,
    // InputSwitchModule,
    // InputTextareaModule,
    // InputNumberModule,
    InputOtpModule,
    // KnobModule,
    // KeyFilterModule,
    // ListboxModule,
    // MultiSelectModule,
    PasswordModule,
    RadioButtonModule,
    // RatingModule,
    // SelectButtonModule,
    // SliderModule,
    // TreeSelectModule,
    // TriStateCheckboxModule,
    // ToggleButtonModule,
    ButtonModule,
    // SplitButtonModule,
    // SpeedDialModule,
    // DataViewModule,
    // OrderListModule,
    // OrganizationChartModule,
    // PaginatorModule,
    // PickListModule,
    // ScrollerModule,
    // TableModule,
    // TimelineModule,
    // TreeModule,
    // TreeTableModule,
    // AccordionModule,
    // CardModule,
    // DividerModule,
    // FieldsetModule,
    // PanelModule,
    // SplitterModule,
    // StepperModule,
    // ScrollPanelModule,
    // TabViewModule,
    // ToolbarModule,
    // ConfirmDialogModule,
    // ConfirmPopupModule,
    // DialogModule,
    // DynamicDialogModule,
    // OverlayPanelModule,
    SidebarModule,
    TooltipModule,
    FileUploadModule,
    // BreadcrumbModule,
    // ContextMenuModule,
    // DockModule,
    // MenuModule,
    // MenubarModule,
    // MegaMenuModule,
    // PanelMenuModule,
    StepsModule,
    // TabMenuModule,
    // TieredMenuModule,
    // ChartModule,
    // MessagesModule,
    ToastModule,
    // CarouselModule,
    // GalleriaModule,
    // ImageModule,
    // DragDropModule,
    // AvatarModule,
    // AvatarGroupModule,
    BadgeModule,
    // BlockUIModule,
    // ChipModule,
    // InplaceModule,
    // MeterGroupModule,
    // ScrollTopModule,
    // SkeletonModule,
    // ProgressBarModule,
    // ProgressSpinnerModule,
    // TagModule,
    // TerminalModule,
    // DeferModule,
    // FocusTrapModule,
    StyleClassModule,
    RippleModule,
    // AutoFocusModule,
    // AnimateOnScrollModule,
  ],
  providers: [
    MessageService
  ]
})
export class PrimeNgModule { }
