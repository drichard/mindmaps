package tests;

import static helper.SeleniumHelper.Root;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import helper.SeleniumHelper.Node;

import org.junit.Test;

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

}
