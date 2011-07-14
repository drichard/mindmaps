package tests;

import static org.junit.Assert.*;
import static helper.SeleniumHelper.*;

import org.junit.Test;

import helper.SeleniumHelper.Node;

public class BasicFunctions extends BaseMindMapsTestCase {
	@Test
	public void testNewDocument() {
		clickNewDocumentButton();
		assertEquals(1, getNodeCount());
		assertTrue(selenium.isElementPresent(Root().get()));
		assertFalse(selenium.isElementPresent(Root().next().get()));
	}

	@Test
	public void testCreateNodeWithAddButton() {
		String nodeId = createNodeFromRoot();
		assertTrue(selenium.isElementPresent(nodeId));

		assertEquals("New Idea", selenium.getText(nodeId));
		assertTrue(selenium.isElementPresent(new Node(nodeId).text().selected()
				.get()));
	}

	@Test
	public void testChangeNodeCaptionWithDoubleClick() {
		selenium.doubleClick(Root().text().get());
		assertTrue(selenium.isElementPresent("caption-editor"));
		selenium.type("caption-editor", "test root");
		sendEnterKeyOnEditor();
		assertEquals("test root", selenium.getText(Root().text().get()));
	}

	@Test
	public void testDragAndDropNode() {
		String nodeId = createNodeFromRoot();

		Number nodePosLeft = selenium.getElementPositionLeft(nodeId);
		selenium.mouseOver(new Node(nodeId).text().get());
		selenium.mouseDown(new Node(nodeId).text().get());
		selenium.dragAndDrop(nodeId, "+200,+100");
		Number nodePosLeft2 = selenium.getElementPositionLeft(nodeId);
		assertEquals(200, nodePosLeft2.intValue() - nodePosLeft.intValue());
	}

	@Test
	public void testDeleteNode() {
		String nodeId = createNodeFromRoot();
		clickDeleteNodeButton();
		assertFalse(selenium.isElementPresent(nodeId));
	}

	@Test
	public void testUndoDeleteNode() {
		String nodeId = createNodeFromRoot();
		clickDeleteNodeButton();
		clickUndoButton();
		assertTrue(selenium.isElementPresent(nodeId));
	}

	@Test
	public void testRedoDeleteNode() {
		String nodeId = createNodeFromRoot();
		clickDeleteNodeButton();
		clickUndoButton();
		clickRedoButton();
		assertFalse(selenium.isElementPresent(nodeId));
	}

	@Test
	public void testCopyCutPasteNode() {
		clickCreateNodeButton();
		clickCreateNodeButton();
		clickCreateNodeButton();

		selenium.mouseDown(Root().next().text().get());
		clickCopyButton();
		selenium.mouseDown(Root().text().get());
		clickPasteButton();
		assertEquals(7, getNodeCount());
		selenium.mouseDown(Root().next().text().get());
		clickCutButton();
		assertEquals(4, getNodeCount());
		clickPasteButton();
		assertEquals(7, getNodeCount());
	}

	@Test
	public void testSaveLocalStorage() {
		clearLocalStorage();
		int lsLengthPast = Integer.valueOf(selenium
				.getEval("window.localStorage.length"));

		createAndSaveMapInLocalStorage();

		int lsLengthNow = Integer.valueOf(selenium
				.getEval("window.localStorage.length"));
		assertEquals(lsLengthPast + 1, lsLengthNow);
	}

	@Test
	public void testOpenMapFromLocalStorage() {
		clearLocalStorage();
		createAndSaveMapInLocalStorage();
		clickOpenDocumentButton();

		assertTrue(selenium.isTextPresent("Open mind map"));
		selenium.click("css=.localstorage-filelist tbody > tr > td > a");
		assertFalse(selenium.isTextPresent("Open mind map"));

		assertTrue(getNodeCount() > 1);
	}

	@Test
	public void testCloseMindMap() {
		clickCloseDocumentButton();
		assertEquals(0, getNodeCount());
	}

	@Test
	public void testCreateNodeByDragAndDrop() {
		int nodeCountPast = getNodeCount();
		selenium.mouseOver(Root().text().get());
		selenium.dragAndDrop("creator-wrapper", "+200, +0");
		int nodeCountNow = getNodeCount();
		assertEquals(nodeCountPast + 1, nodeCountNow);
	}

	@Test
	public void testFoldNode() {
		clickCreateNodeButton();
		clickCreateNodeButton();
		selenium.click(Root().next().foldButton().get());
		assertFalse(selenium.isVisible(Root().next().next().get()));

		selenium.click(Root().next().foldButton().get());
		assertTrue(selenium.isVisible(Root().next().next().get()));
	}

	@Test
	public void testChangeFontSize() {
		String nodeId = createNodeFromRoot();
		String stylePath = new Node(nodeId).style();

		String style = selenium.getAttribute(stylePath);
		Integer fontSizeBefore = getFontSize(style);
		assertNotNull(fontSizeBefore);

		// increase
		clickIncreaseFontSizeButton();
		style = selenium.getAttribute(stylePath);
		Integer fontSizePlus = getFontSize(style);
		assertTrue(fontSizePlus > fontSizeBefore);

		// decrease again. should be same as before
		clickDecreaseFontSizeButton();
		style = selenium.getAttribute(stylePath);
		Integer fontSizePlusMinus = getFontSize(style);
		assertTrue(fontSizeBefore == fontSizePlusMinus);

		clickDecreaseFontSizeButton();
		style = selenium.getAttribute(stylePath);
		Integer fontSizePlusMinusMinus = getFontSize(style);
		assertTrue(fontSizeBefore > fontSizePlusMinusMinus);
	}

	@Test
	public void testChangeFontWeight() {
		String nodeId = createNodeFromRoot();
		String stylePath = new Node(nodeId).text().style();

		String style = selenium.getAttribute(stylePath);
		String fontWeightBefore = getFontWeight(style);
		assertEquals("normal", fontWeightBefore);

		clickToggleFontBoldButton();
		style = selenium.getAttribute(stylePath);
		String fontWeightAfterClick = getFontWeight(style);
		assertEquals("bold", fontWeightAfterClick);

		clickToggleFontBoldButton();
		style = selenium.getAttribute(stylePath);
		String fontWeightAfterClickTwice = getFontWeight(style);
		assertEquals(fontWeightBefore, fontWeightAfterClickTwice);
	}

	@Test
	public void testChangeFontStyle() {
		String nodeId = createNodeFromRoot();
		String stylePath = new Node(nodeId).text().style();

		String style = selenium.getAttribute(stylePath);
		String fontStyleBefore = getFontStyle(style);
		assertEquals("normal", fontStyleBefore);

		clickToggleFontItalicButton();
		style = selenium.getAttribute(stylePath);
		String fontStyleAfterClick = getFontStyle(style);
		assertEquals("italic", fontStyleAfterClick);

		clickToggleFontItalicButton();
		style = selenium.getAttribute(stylePath);
		String fontStyleAfterClickTwice = getFontStyle(style);
		assertEquals(fontStyleBefore, fontStyleAfterClickTwice);
	}

	@Test
	public void testChangeFontUnderline() {
		String nodeId = createNodeFromRoot();
		String stylePath = new Node(nodeId).text().style();

		String style = selenium.getAttribute(stylePath);
		String fontUnderlineBefore = getTextDecoration(style);
		assertEquals("none", fontUnderlineBefore);

		clickToggleFontUnderlineButton();
		style = selenium.getAttribute(stylePath);
		String fontUnderlineAfterClick = getTextDecoration(style);
		assertEquals("underline", fontUnderlineAfterClick);

		clickToggleFontUnderlineButton();
		style = selenium.getAttribute(stylePath);
		String fontUnderlineAfterClickTwice = getTextDecoration(style);
		assertEquals(fontUnderlineBefore, fontUnderlineAfterClickTwice);
	}

	@Test
	public void testChangeNodeFontColor() {
		String nodeId = createNodeFromRoot();
		String stylePath = new Node(nodeId).text().style();

		String style = selenium.getAttribute(stylePath);
		String textColorBefore = getTextColor(style);

		// open and choose any color from color picker, close it
		selenium.click("css=a.miniColors-trigger");
		selenium.mouseDownAt("css=.miniColors-colors", "50,50");
		selenium.mouseDown("css=.miniColors-overlay");

		style = selenium.getAttribute(stylePath);
		String textColorAfter = getTextColor(style);
		assertFalse(textColorBefore.equals(textColorAfter));

		// chose second color
		selenium.click("css=a.miniColors-trigger");
		selenium.mouseDownAt("css=.miniColors-colors", "80,40");
		selenium.mouseDown("css=.miniColors-overlay");

		style = selenium.getAttribute(stylePath);
		String textColorAfterSecondTime = getTextColor(style);
		assertFalse(textColorAfter.equals(textColorAfterSecondTime));
	}

}
