package tests;

import static helper.SeleniumHelper.Root;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;

import com.thoughtworks.selenium.DefaultSelenium;

public class BaseMindMapsTestCase {

	protected static DefaultSelenium selenium;

	static class Browser {
		final static String FIREFOX = "*firefox";
		final static String CHROME = "*googlechrome";
		final static String IE = "*iexplore";
	}

	static class Server {
		final static String DEVELOPMENT = "http://localhost:8080/debug/";
		final static String PRODUCTION = "http://drichard.org/mindmaps/";
	}

	@BeforeClass
	public static void setUp() {
		selenium = new DefaultSelenium("localhost", 4444, Browser.CHROME,
				Server.DEVELOPMENT);
		selenium.start();
	}

	@AfterClass
	public static void tearDown() {
		selenium.stop();
	}

	@Before
	public void before() {
		selenium.open("");
	}

	protected String createNodeFromRoot() {
		clickNewDocumentButton();
		clickCreateNodeButton();
		sendEnterKeyOnEditor();

		String nodeId = selenium.getAttribute(Root().next().id());
		assertNotNull(nodeId);
		assertTrue(!nodeId.isEmpty());
		return nodeId;
	}

	protected void sendEnterKeyOnEditor() {
		// simulate pressing the enter key by sending the key event to the
		// editor. keyDown with \13 does work on FF but not on chrome
		String simulateEnterKey = "var e = window.jQuery.Event(\"keydown\");"
				+ "e.which = 13;" + "window.$(\"#caption-editor\").trigger(e)";
		selenium.getEval(simulateEnterKey);

		// selenium.keyDown("caption-editor", "\\13");
	}

	protected void createAndSaveMapInLocalStorage() {
		clickCreateNodeButton();
		clickCreateNodeButton();
		clickCreateNodeButton();
		selenium.mouseDown(Root().text().get());
		clickCreateNodeButton();
		clickCreateNodeButton();
		clickCreateNodeButton();
		clickCreateNodeButton();
		selenium.mouseDown(Root().next().text().get());
		clickCreateNodeButton();
		clickSaveDocumentButton();

		assertTrue(selenium.isTextPresent("Save mind map"));
		selenium.click("button-save-localstorage");
		assertFalse(selenium.isTextPresent("Save mind map"));
	}

	protected void clearLocalStorage() {
		selenium.getEval("window.localStorage.clear()");
	}

	protected int getNodeCount() {
		return selenium.getCssCount("css=.node-container").intValue();
	}

	protected void clickCreateNodeButton() {
		selenium.click("button-CREATE_NODE_COMMAND");
	}

	protected void clickDeleteNodeButton() {
		selenium.click("button-DELETE_NODE_COMMAND");
	}

	protected void clickUndoButton() {
		selenium.click("button-UNDO_COMMAND");
	}

	protected void clickRedoButton() {
		selenium.click("button-REDO_COMMAND");
	}

	protected void clickCopyButton() {
		selenium.click("button-COPY_COMMAND");
	}

	protected void clickCutButton() {
		selenium.click("button-CUT_COMMAND");
	}

	protected void clickPasteButton() {
		selenium.click("button-PASTE_COMMAND");
	}

	protected void clickNewDocumentButton() {
		selenium.click("button-NEW_DOCUMENT_COMMAND");
	}

	protected void clickOpenDocumentButton() {
		selenium.click("button-OPEN_DOCUMENT_COMMAND");
	}

	protected void clickSaveDocumentButton() {
		selenium.click("button-SAVE_DOCUMENT_COMMAND");
	}

	protected void clickCloseDocumentButton() {
		selenium.click("button-CLOSE_DOCUMENT_COMMAND");
	}

	protected void clickIncreaseFontSizeButton() {
		selenium.click("inspector-button-font-size-increase");
	}

	protected void clickDecreaseFontSizeButton() {
		selenium.click("inspector-button-font-size-decrease");
	}

	protected void clickToggleFontUnderlineButton() {
		selenium.click("inspector-checkbox-font-underline");
	}

	protected void clickToggleFontItalicButton() {
		selenium.click("inspector-checkbox-font-italic");
	}

	protected void clickToggleFontBoldButton() {
		selenium.click("inspector-checkbox-font-bold");
	}
}